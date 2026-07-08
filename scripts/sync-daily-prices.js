const { createClient } = require('@supabase/supabase-js');
let chromium;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BESTBUY_API_KEY = process.env.BESTBUY_API_KEY || '';
const TRIGGER_TYPE = process.env.TRIGGER_TYPE || 'scheduled';
const ENABLE_BROWSER_SCRAPER = process.env.ENABLE_BROWSER_SCRAPER !== 'false';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

function numberOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const cleaned = String(value).replace(/[^0-9.]/g, '');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function realisticPriceOrNull(value) {
  const price = numberOrNull(value);
  if (price === null || price <= 0 || price > 100000) return null;
  return price;
}

function readPath(obj, path) {
  if (!path) return undefined;
  return String(path).split('.').reduce((acc, key) => {
    if (acc === null || acc === undefined) return undefined;
    if (Array.isArray(acc) && /^\d+$/.test(key)) return acc[Number(key)];
    return acc[key];
  }, obj);
}

function priceMath(originalPrice, currentPrice) {
  const original = numberOrNull(originalPrice);
  const current = numberOrNull(currentPrice);
  if (original === null || current === null || original <= current) {
    return { percent_off: null, save_amount: null };
  }
  const save = Number((original - current).toFixed(2));
  return {
    percent_off: Math.round((save / original) * 100),
    save_amount: save
  };
}

async function createRun() {
  const { data, error } = await supabase
    .from('deal_price_refresh_runs')
    .insert({ trigger_type: TRIGGER_TYPE, status: 'running' })
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

async function finishRun(id, patch) {
  await supabase
    .from('deal_price_refresh_runs')
    .update(Object.assign({ finished_at: new Date().toISOString() }, patch))
    .eq('id', id);
}

async function loadProducts() {
  const { data, error } = await supabase
    .from('deal_tracked_products')
    .select('*')
    .eq('enabled', true)
    .order('is_food_low_price', { ascending: false })
    .order('is_hot', { ascending: false });
  if (error) throw error;
  return data || [];
}

async function fetchJsonFeed(product) {
  const config = product.source_config || {};
  if (!product.source_url) throw new Error('Missing source_url');
  const response = await fetch(product.source_url, {
    headers: {
      'accept': 'application/json,text/plain,*/*',
      'user-agent': 'leshenghuo-price-cache/4.51'
    }
  });
  if (!response.ok) throw new Error(`Feed HTTP ${response.status}`);
  const data = await response.json();
  return {
    current_price: numberOrNull(readPath(data, config.price_path)),
    original_price: numberOrNull(readPath(data, config.original_price_path)),
    stock_status: readPath(data, config.stock_path) || product.manual_stock_status || 'unknown',
    raw_payload: data
  };
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractJsonLdObjects(html) {
  const blocks = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = re.exec(html))) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (Array.isArray(parsed)) blocks.push(...parsed);
      else blocks.push(parsed);
    } catch (_) {}
  }
  return blocks;
}

function flattenJsonLd(value, out = []) {
  if (!value || typeof value !== 'object') return out;
  if (Array.isArray(value)) {
    value.forEach(item => flattenJsonLd(item, out));
    return out;
  }
  out.push(value);
  if (value['@graph']) flattenJsonLd(value['@graph'], out);
  if (value.offers) flattenJsonLd(value.offers, out);
  return out;
}

function firstPriceFromJsonLd(html) {
  const nodes = extractJsonLdObjects(html).flatMap(item => flattenJsonLd(item, []));
  for (const node of nodes) {
    const type = Array.isArray(node['@type']) ? node['@type'].join(' ') : String(node['@type'] || '');
    const looksRelevant = /Product|Offer|AggregateOffer/i.test(type) || node.price || node.lowPrice || node.highPrice || node.offers;
    if (!looksRelevant) continue;
    const price = numberOrNull(node.price ?? node.lowPrice ?? node.salePrice);
    if (price !== null) return { price, raw: node };
  }
  return null;
}

function extractMetaContent(html, names) {
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i');
    const match = html.match(re);
    if (match) return match[1];
  }
  return null;
}

function detectBlockedPage(html) {
  const text = stripHtml(html).toLowerCase();
  return text.includes('captcha') ||
    text.includes('access denied') ||
    text.includes('robot or human') ||
    text.includes('verify you are a human') ||
    text.includes('akamai') ||
    text.includes('blocked');
}

const PRICE_SELECTORS_BY_RETAILER = {
  walmart: [
    '[itemprop="price"]',
    '[data-testid="price-wrap"]',
    '[data-testid="price"]',
    '[data-automation-id="product-price"]',
    'span[itemprop="price"]'
  ],
  target: [
    '[data-test="product-price"]',
    '[data-test="product-price-value"]',
    '[data-test="product-price-block"]',
    '[itemprop="price"]'
  ],
  bestbuy: [
    '.priceView-customer-price span',
    '[data-testid="customer-price"]',
    '[itemprop="price"]'
  ],
  macys: [
    '[data-testid="price"]',
    '.price',
    '[itemprop="price"]'
  ],
  aldi: [
    '[itemprop="price"]',
    '[data-testid*="price"]',
    '.price'
  ],
  costco: [
    '[automation-id="productPriceOutput"]',
    '[data-testid="product-price"]',
    '.price',
    '[itemprop="price"]'
  ],
  samsclub: [
    '[data-testid="price-characteristic"]',
    '[data-testid="price"]',
    '.Price-characteristic',
    '[itemprop="price"]'
  ]
};

function extractPriceFromText(text) {
  const candidates = String(text || '').match(/\$\s?\d{1,5}(?:,\d{3})*(?:\.\d{2})?/g) || [];
  for (const candidate of candidates) {
    const price = realisticPriceOrNull(candidate);
    if (price !== null) return price;
  }
  return null;
}

async function loadChromium() {
  if (!chromium) {
    ({ chromium } = require('playwright'));
  }
  return chromium;
}

async function fetchWithBrowser(product) {
  if (!ENABLE_BROWSER_SCRAPER) throw new Error('Browser scraper disabled');
  const browserType = await loadChromium();
  const browser = await browserType.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled']
  });
  const context = await browser.newContext({
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1365, height: 900 }
  });
  const page = await context.newPage();
  try {
    await page.goto(product.source_url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(3500);
    const title = await page.title().catch(() => '');
    const bodyText = await page.locator('body').innerText({ timeout: 8000 }).catch(() => '');
    if (detectBlockedPage(`${title} ${bodyText}`)) {
      throw new Error('Browser page blocked or captcha required');
    }

    const selectors = [
      ...((product.source_config && product.source_config.price_selector) ? [product.source_config.price_selector] : []),
      ...(PRICE_SELECTORS_BY_RETAILER[product.retailer_key] || []),
      '[itemprop="price"]'
    ];

    let price = null;
    let selectorUsed = null;
    for (const selector of selectors) {
      const elements = await page.locator(selector).all().catch(() => []);
      for (const el of elements.slice(0, 8)) {
        const text = await el.innerText({ timeout: 1500 }).catch(() => '');
        price = extractPriceFromText(text);
        if (price !== null) {
          selectorUsed = selector;
          break;
        }
      }
      if (price !== null) break;
    }
    if (price === null) price = extractPriceFromText(bodyText);
    if (price === null) throw new Error('No price found with browser');

    const finalUrl = page.url();
    const stockText = bodyText.toLowerCase();
    return {
      current_price: price,
      original_price: null,
      stock_status: stockText.includes('out of stock') || stockText.includes('sold out') ? 'out_of_stock' : 'unknown',
      source_url: finalUrl || product.source_url,
      raw_payload: {
        source: 'playwright_browser',
        selector_used: selectorUsed,
        final_url: finalUrl,
        title,
        extracted_at: new Date().toISOString()
      }
    };
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}

async function fetchPublicProductPage(product) {
  if (!product.source_url) throw new Error('Missing source_url');
  let response;
  try {
    response = await fetch(product.source_url, {
      redirect: 'follow',
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'user-agent': 'Mozilla/5.0 (compatible; LeshenghuoPriceBot/4.51; +https://escoopcity.com)'
      }
    });
  } catch (_) {
    return fetchWithBrowser(product);
  }
  if (!response.ok) return fetchWithBrowser(product);
  const html = await response.text();
  if (detectBlockedPage(html)) return fetchWithBrowser(product);

  const jsonLdPrice = firstPriceFromJsonLd(html);
  const metaPrice = numberOrNull(extractMetaContent(html, [
    'product:price:amount',
    'og:price:amount',
    'twitter:data1'
  ]));
  const config = product.source_config || {};
  const regexPrice = config.price_regex ? numberOrNull((html.match(new RegExp(config.price_regex, 'i')) || [])[1]) : null;
  const currentPrice = jsonLdPrice?.price ?? metaPrice ?? regexPrice;
  if (currentPrice === null) return fetchWithBrowser(product);

  return {
    current_price: currentPrice,
    original_price: null,
    stock_status: /out of stock|sold out|unavailable/i.test(stripHtml(html)) ? 'out_of_stock' : 'unknown',
    source_url: response.url || product.source_url,
    raw_payload: {
      source: 'public_page_fetch',
      final_url: response.url || product.source_url,
      json_ld: jsonLdPrice?.raw || null,
      extracted_at: new Date().toISOString()
    }
  };
}

async function fetchBestBuy(product) {
  if (!BESTBUY_API_KEY) throw new Error('Missing BESTBUY_API_KEY');
  const sku = product.product_key;
  if (!sku) throw new Error('Missing Best Buy SKU in product_key');
  const url = `https://api.bestbuy.com/v1/products(sku=${encodeURIComponent(sku)})?apiKey=${encodeURIComponent(BESTBUY_API_KEY)}&format=json&show=sku,name,salePrice,regularPrice,onlineAvailability,url`;
  const response = await fetch(url, { headers: { 'accept': 'application/json' } });
  if (!response.ok) throw new Error(`Best Buy HTTP ${response.status}`);
  const json = await response.json();
  const item = json.products && json.products[0];
  if (!item) throw new Error('Best Buy product not found');
  return {
    current_price: numberOrNull(item.salePrice),
    original_price: numberOrNull(item.regularPrice),
    stock_status: item.onlineAvailability ? 'in_stock' : 'unknown',
    source_url: item.url || product.source_url,
    raw_payload: item
  };
}

async function resolvePrice(product) {
  if (product.source_type === 'bestbuy_api' || product.source_type === 'official_api') {
    if (product.retailer_key === 'bestbuy') return fetchBestBuy(product);
  }
  if (product.source_type === 'json_feed' || product.source_type === 'affiliate_feed' || product.source_type === 'manual_json') {
    return fetchJsonFeed(product);
  }
  if (product.source_type === 'public_page' || product.source_type === 'experimental_scraper') {
    return fetchPublicProductPage(product);
  }
  return {
    current_price: numberOrNull(product.manual_current_price),
    original_price: numberOrNull(product.manual_original_price),
    stock_status: product.manual_stock_status || 'unknown',
    raw_payload: { source: 'manual_cache' }
  };
}

async function upsertDailyCache(product, resolved) {
  const currentPrice = numberOrNull(resolved.current_price);
  const originalPrice = numberOrNull(resolved.original_price);
  const math = priceMath(originalPrice, currentPrice);
  const today = new Date().toISOString().slice(0, 10);
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 60 * 60 * 1000);

  const payload = {
    product_id: product.id,
    price_date: today,
    retailer_key: product.retailer_key,
    retailer_name: product.retailer_name,
    category: product.category || 'general',
    product_name: product.product_name,
    product_name_cn: product.product_name_cn,
    original_price: originalPrice,
    current_price: currentPrice,
    unit: product.unit,
    percent_off: math.percent_off,
    save_amount: math.save_amount,
    location: product.location,
    source_url: resolved.source_url || product.source_url,
    source_type: product.source_type,
    stock_status: resolved.stock_status || 'unknown',
    is_food_low_price: product.is_food_low_price === true,
    is_hot: product.is_hot === true,
    price_note: '每日缓存价格。用户访问页面时只读取乐生活数据库，不实时抓取外部网站。',
    ai_summary_cn: product.ai_summary_cn,
    raw_payload: resolved.raw_payload || {},
    refreshed_at: now.toISOString(),
    expires_at: expires.toISOString(),
    updated_at: now.toISOString()
  };

  const { error } = await supabase
    .from('deal_daily_price_cache')
    .upsert(payload, { onConflict: 'product_id,price_date' });
  if (error) throw error;

  await supabase
    .from('deal_tracked_products')
    .update({
      last_checked_at: now.toISOString(),
      last_success_at: now.toISOString(),
      last_error: null,
      updated_at: now.toISOString()
    })
    .eq('id', product.id);
}

async function markProductError(product, message) {
  await supabase
    .from('deal_tracked_products')
    .update({
      last_checked_at: new Date().toISOString(),
      last_error: String(message).slice(0, 1000),
      updated_at: new Date().toISOString()
    })
    .eq('id', product.id);
}

async function main() {
  const runId = await createRun();
  let checked = 0;
  let success = 0;
  let failed = 0;
  let skipped = 0;
  const errors = [];

  try {
    const products = await loadProducts();
    for (const product of products) {
      checked += 1;
      try {
        const resolved = await resolvePrice(product);
        if (resolved.current_price === null && !product.ai_summary_cn) {
          skipped += 1;
          continue;
        }
        await upsertDailyCache(product, resolved);
        success += 1;
      } catch (error) {
        failed += 1;
        errors.push(`${product.retailer_key}/${product.product_name}: ${error.message}`);
        await markProductError(product, error.message);
      }
    }

    await finishRun(runId, {
      status: failed ? 'partial_success' : 'success',
      checked_count: checked,
      success_count: success,
      failed_count: failed,
      skipped_count: skipped,
      error_message: errors.slice(0, 8).join('\n') || null
    });
  } catch (error) {
    await finishRun(runId, {
      status: 'failed',
      checked_count: checked,
      success_count: success,
      failed_count: failed + 1,
      skipped_count: skipped,
      error_message: error.message
    });
    throw error;
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
