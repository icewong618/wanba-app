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

const RETAILER_ADAPTERS = {
  walmart: {
    selectors: ['[itemprop="price"]', '[data-testid="price-wrap"]', '[data-testid="price"]', '[data-automation-id="product-price"]', 'span[itemprop="price"]'],
    productUrlPattern: /\/ip\//i,
    searchResultSelector: '[data-item-id], [data-testid="item-stack"], [role="group"]',
    priceRange: [0.1, 5000],
    suspiciousIfSearchUrl: true,
    dealLandingPattern: /\/shop\/deals\/flash-deals/i
  },
  target: {
    selectors: ['[data-test="product-price"]', '[data-test="product-price-value"]', '[data-test="product-price-block"]', '[itemprop="price"]'],
    productUrlPattern: /\/p\//i,
    searchResultSelector: '[data-test="@web/site-top-of-funnel/ProductCardWrapper"], [data-test="product-card"]',
    priceRange: [0.1, 5000],
    suspiciousIfSearchUrl: true,
    dealLandingPattern: /\/weekly-ad/i
  },
  bestbuy: {
    selectors: ['.priceView-customer-price span', '[data-testid="customer-price"]', '[itemprop="price"]'],
    productUrlPattern: /\/site\/.+\/\d+\.p/i,
    searchResultSelector: '.sku-item, [data-testid="product-card"]',
    priceRange: [5, 10000],
    suspiciousIfSearchUrl: true,
    dealLandingPattern: /deal-of-the-day/i
  },
  macys: {
    selectors: ['[data-testid="price"]', '.price', '[itemprop="price"]'],
    productUrlPattern: /\/shop\/product\//i,
    searchResultSelector: '[data-testid="product-card"], .productThumbnail',
    priceRange: [1, 10000],
    suspiciousIfSearchUrl: true
  },
  aldi: {
    selectors: ['[itemprop="price"]', '[data-testid*="price"]', '.price'],
    productUrlPattern: /weekly-specials|products/i,
    searchResultSelector: '[class*="product"], article',
    priceRange: [0.1, 500],
    suspiciousIfSearchUrl: false,
    dealLandingPattern: /weekly-specials|weekly-ads/i
  },
  costco: {
    selectors: ['[automation-id="productPriceOutput"]', '[data-testid="product-price"]', '.price', '[itemprop="price"]'],
    productUrlPattern: /\.product\./i,
    searchResultSelector: '[automation-id*="product"], [class*="product"]',
    priceRange: [0.1, 50000],
    suspiciousIfSearchUrl: true,
    experimental: true
  },
  samsclub: {
    selectors: ['[data-testid="price-characteristic"]', '[data-testid="price"]', '.Price-characteristic', '[itemprop="price"]'],
    productUrlPattern: /\/p\/|prod/i,
    searchResultSelector: '[data-testid*="product"], [class*="product"]',
    priceRange: [0.1, 50000],
    suspiciousIfSearchUrl: true,
    experimental: true
  }
};

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
      'user-agent': 'leshenghuo-price-cache/4.92'
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

function extractPriceFromText(text) {
  const candidates = String(text || '').match(/\$\s?\d{1,5}(?:,\d{3})*(?:\.\d{2})?/g) || [];
  for (const candidate of candidates) {
    const price = realisticPriceOrNull(candidate);
    if (price !== null) return price;
  }
  return null;
}

function getAdapter(product) {
  return Object.assign({}, RETAILER_ADAPTERS[product.retailer_key] || {}, product.source_config || {});
}

function costcoProductId(product) {
  const fromKey = String(product.product_key || '').match(/\d{5,}/)?.[0];
  if (fromKey) return fromKey;
  const fromUrl = String(product.source_url || '').match(/(?:product\.|\/)(\d{5,})(?:\.html|\?|$)/i)?.[1];
  return fromUrl || null;
}

function sourceUrlCandidates(product) {
  const urls = [product.source_url].filter(Boolean);
  if (product.retailer_key === 'costco') {
    const id = costcoProductId(product);
    if (id) {
      urls.push(`https://www.costco.com/.product.${id}.html`);
      urls.push(`https://www.costco.com/CatalogSearch?keyword=${encodeURIComponent(id)}`);
    }
    const clean = String(product.source_url || '').split('?')[0];
    if (clean && clean !== product.source_url) urls.push(clean);
  }
  return [...new Set(urls)];
}

function isLikelyProductUrl(product, adapter) {
  if (product.source_type === 'fixed_product_page') return true;
  if (!adapter.productUrlPattern) return true;
  return adapter.productUrlPattern.test(product.source_url || '');
}

function sourceCadence(product) {
  if (product.source_type === 'weekly_ad_page') return 'weekly';
  if (product.source_type === 'daily_deals_page') return 'daily';
  if (product.source_type === 'fixed_product_page') return 'daily';
  return product.refresh_frequency_hours >= 168 ? 'weekly' : 'daily';
}

function landingPageTitle(product) {
  const cadence = sourceCadence(product);
  if (product.source_type === 'weekly_ad_page') return `${product.retailer_name} 官方每周优惠`;
  if (product.source_type === 'daily_deals_page') return `${product.retailer_name} 官方限时优惠`;
  return cadence === 'weekly' ? `${product.retailer_name} 官方周优惠` : `${product.retailer_name} 官方优惠`;
}

function landingPageNote(product) {
  if (product.source_type === 'weekly_ad_page') {
    return '官方周优惠入口。只有抓到具体商品名和价格时才显示价格；否则请进入官网核对当周广告。';
  }
  if (product.source_type === 'daily_deals_page') {
    return '官方限时优惠入口。用于发现今日值得看的折扣，不把分类页价格伪装成单品价格。';
  }
  return '官方来源入口。价格和库存以官网最终显示为准。';
}

async function fetchDealLandingPage(product) {
  if (!product.source_url) throw new Error('Missing source_url');
  const adapter = getAdapter(product);
  let finalUrl = product.source_url;
  let title = landingPageTitle(product);
  let blocked = false;

  try {
    const response = await fetch(product.source_url, {
      redirect: 'follow',
      headers: {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'user-agent': 'Mozilla/5.0 (compatible; LeshenghuoPriceBot/4.92; +https://escoopcity.com)'
      }
    });
    if (response.ok) {
      finalUrl = response.url || product.source_url;
      const html = await response.text();
      blocked = detectBlockedPage(html);
      const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (titleMatch) title = stripHtml(titleMatch[1]).slice(0, 120) || title;
    } else {
      blocked = true;
    }
  } catch (_) {
    blocked = true;
  }

  return {
    current_price: null,
    original_price: null,
    stock_status: blocked ? 'unknown' : 'in_stock',
    source_url: finalUrl,
    price_note: landingPageNote(product),
    raw_payload: {
      source: 'official_deal_landing',
      landing_type: product.source_type,
      cadence: sourceCadence(product),
      title,
      blocked,
      final_url: finalUrl,
      needs_review: true,
      review_flags: [
        product.source_type === 'weekly_ad_page' ? 'weekly_ad_landing_page' : 'daily_deals_landing_page',
        'no_specific_product_price'
      ],
      deal_landing_pattern_matched: adapter.dealLandingPattern ? adapter.dealLandingPattern.test(finalUrl) : null,
      extracted_at: new Date().toISOString()
    }
  };
}

function productKeywords(product) {
  const raw = `${product.product_name || ''} ${product.product_name_cn || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !['with','and','the','sale','large'].includes(w));
  return [...new Set(raw)].slice(0, 8);
}

function matchScore(text, keywords) {
  const lower = String(text || '').toLowerCase();
  return keywords.reduce((sum, kw) => sum + (lower.includes(kw) ? 1 : 0), 0);
}

function reviewFlags(product, price, finalUrl, adapter, extractionSource) {
  const flags = [];
  const range = adapter.priceRange || [0.01, 100000];
  if (price < range[0] || price > range[1]) flags.push('price_out_of_range');
  if (adapter.suspiciousIfSearchUrl && !isLikelyProductUrl(product, adapter)) flags.push('search_url_needs_exact_product');
  if (adapter.experimental) flags.push('experimental_retailer');
  if (extractionSource === 'body_text') flags.push('weak_body_text_match');
  if (finalUrl && adapter.productUrlPattern && !adapter.productUrlPattern.test(finalUrl)) flags.push('final_url_not_product_page');
  return flags;
}

async function loadChromium() {
  if (!chromium) {
    ({ chromium } = require('playwright'));
  }
  return chromium;
}

async function fetchWithBrowser(product) {
  if (!ENABLE_BROWSER_SCRAPER) throw new Error('Browser scraper disabled');
  const adapter = getAdapter(product);
  const browserType = await loadChromium();
  const browser = await browserType.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled', '--disable-http2']
  });
  const context = await browser.newContext({
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1365, height: 900 }
  });
  const page = await context.newPage();
  try {
    let navigationError = null;
    let navigatedUrl = null;
    for (const candidate of sourceUrlCandidates(product)) {
      try {
        await page.goto(candidate, { waitUntil: 'domcontentloaded', timeout: 45000 });
        navigatedUrl = candidate;
        break;
      } catch (error) {
        navigationError = error;
      }
    }
    if (!navigatedUrl) throw navigationError || new Error('Navigation failed');
    await page.waitForTimeout(3500);
    const title = await page.title().catch(() => '');
    const bodyText = await page.locator('body').innerText({ timeout: 8000 }).catch(() => '');
    if (detectBlockedPage(`${title} ${bodyText}`)) {
      throw new Error('Browser page blocked or captcha required');
    }

    const selectors = [
      ...((adapter.price_selector) ? [adapter.price_selector] : []),
      ...(adapter.selectors || []),
      '[itemprop="price"]'
    ];

    let price = null;
    let selectorUsed = null;
    let extractionSource = null;
    const keywords = productKeywords(product);

    if (!isLikelyProductUrl(product, adapter) && adapter.searchResultSelector) {
      const cards = await page.locator(adapter.searchResultSelector).all().catch(() => []);
      let bestCard = null;
      let bestScore = 0;
      for (const card of cards.slice(0, 12)) {
        const cardText = await card.innerText({ timeout: 1500 }).catch(() => '');
        const score = matchScore(cardText, keywords);
        if (score > bestScore) {
          bestScore = score;
          bestCard = card;
        }
      }
      if (bestCard && bestScore > 0) {
        for (const selector of selectors) {
          const elements = await bestCard.locator(selector).all().catch(() => []);
          for (const el of elements.slice(0, 5)) {
            const text = await el.innerText({ timeout: 1500 }).catch(() => '');
            price = extractPriceFromText(text);
            if (price !== null) {
              selectorUsed = selector;
              extractionSource = `search_card_score_${bestScore}`;
              break;
            }
          }
          if (price !== null) break;
        }
        if (price === null) {
          const cardText = await bestCard.innerText({ timeout: 1500 }).catch(() => '');
          price = extractPriceFromText(cardText);
          if (price !== null) extractionSource = `search_card_text_score_${bestScore}`;
        }
      }
    }

    for (const selector of selectors) {
      if (price !== null) break;
      const elements = await page.locator(selector).all().catch(() => []);
      for (const el of elements.slice(0, 8)) {
        const text = await el.innerText({ timeout: 1500 }).catch(() => '');
        price = extractPriceFromText(text);
        if (price !== null) {
          selectorUsed = selector;
          extractionSource = 'page_selector';
          break;
        }
      }
      if (price !== null) break;
    }
    if (price === null) {
      price = extractPriceFromText(bodyText);
      if (price !== null) extractionSource = 'body_text';
    }
    if (price === null) throw new Error('No price found with browser');

    const finalUrl = page.url();
    const stockText = bodyText.toLowerCase();
    const flags = reviewFlags(product, price, finalUrl, adapter, extractionSource);
    return {
      current_price: price,
      original_price: null,
      stock_status: stockText.includes('out of stock') || stockText.includes('sold out') ? 'out_of_stock' : 'unknown',
      source_url: finalUrl || product.source_url,
      raw_payload: {
        source: 'playwright_browser',
        selector_used: selectorUsed,
        extraction_source: extractionSource,
        needs_review: flags.length > 0,
        review_flags: flags,
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
        'user-agent': 'Mozilla/5.0 (compatible; LeshenghuoPriceBot/4.92; +https://escoopcity.com)'
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
  const adapter = getAdapter(product);
  const finalUrl = response.url || product.source_url;
  const flags = reviewFlags(product, currentPrice, finalUrl, adapter, jsonLdPrice ? 'json_ld' : (metaPrice ? 'meta' : 'regex'));

  return {
    current_price: currentPrice,
    original_price: null,
    stock_status: /out of stock|sold out|unavailable/i.test(stripHtml(html)) ? 'out_of_stock' : 'unknown',
    source_url: finalUrl,
    raw_payload: {
      source: 'public_page_fetch',
      final_url: finalUrl,
      json_ld: jsonLdPrice?.raw || null,
      needs_review: flags.length > 0,
      review_flags: flags,
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
  if (product.source_type === 'weekly_ad_page' || product.source_type === 'daily_deals_page') {
    return fetchDealLandingPage(product);
  }
  if (product.source_type === 'bestbuy_api' || product.source_type === 'official_api') {
    if (product.retailer_key === 'bestbuy') return fetchBestBuy(product);
  }
  if (product.source_type === 'json_feed' || product.source_type === 'affiliate_feed' || product.source_type === 'manual_json') {
    return fetchJsonFeed(product);
  }
  if ([
    'public_page',
    'experimental_scraper',
    'github_scraper',
    'playwright_config',
    'target_scraper_config',
    'costco_product_tracker',
    'walmart_omkar_api',
    'fixed_product_page'
  ].includes(product.source_type)) {
    return fetchPublicProductPage(product);
  }
  if (product.source_type && !['manual', 'manual_verified', 'community_report'].includes(product.source_type)) {
    throw new Error(`Unsupported source_type ${product.source_type}`);
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
  const refreshHours = Number(product.refresh_frequency_hours || 24);
  const expires = new Date(now.getTime() + Math.max(30, refreshHours + 6) * 60 * 60 * 1000);
  const isLandingPage = ['weekly_ad_page', 'daily_deals_page'].includes(product.source_type);

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
    price_note: resolved.price_note || (isLandingPage
      ? landingPageNote(product)
      : (resolved.raw_payload && resolved.raw_payload.needs_review
        ? '每日缓存价格。自动抓取结果需要复核，请以官网最终显示为准。'
        : '每日缓存价格。用户访问页面时只读取乐生活数据库，不实时抓取外部网站。')),
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

function shouldRefreshProduct(product) {
  const hours = Number(product.refresh_frequency_hours || 24);
  if (!product.last_success_at) return true;
  const last = new Date(product.last_success_at).getTime();
  if (!Number.isFinite(last)) return true;
  const ageHours = (Date.now() - last) / (60 * 60 * 1000);
  return ageHours >= Math.max(1, hours - 0.25);
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
        if (!shouldRefreshProduct(product)) {
          skipped += 1;
          continue;
        }
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
