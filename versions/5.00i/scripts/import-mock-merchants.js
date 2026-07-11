#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DEFAULT_SUPABASE_URL = 'https://ptxdxepmggmjcndgukjk.supabase.co';
const DEFAULT_SOURCE_DIR = path.resolve(__dirname, '..', '商家模拟资料');
const LOCAL_CODEX_SOURCE_DIR = '/Users/alan/Documents/Codex/乐生活/商家模拟资料';
const DEFAULT_PASSWORD = 'CS130523';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    if (key && process.env[key] == null) process.env[key] = value;
  }
}

loadDotEnv(path.resolve(__dirname, '..', '.env'));
loadDotEnv(path.resolve(__dirname, '..', '.env.local'));

const SUPABASE_URL = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const SOURCE_DIR = process.env.MOCK_MERCHANT_SOURCE_DIR
  || (fs.existsSync(DEFAULT_SOURCE_DIR) ? DEFAULT_SOURCE_DIR : LOCAL_CODEX_SOURCE_DIR);
const PASSWORD = process.env.MOCK_MERCHANT_PASSWORD || DEFAULT_PASSWORD;

if (!dryRun && !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY. Put it in .env.local or export it before running.');
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function dataUrl(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return '';
  const ext = path.extname(filePath).toLowerCase().replace('.', '') || 'png';
  const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`;
}

function moneyText(value) {
  if (value == null || value === '') return '';
  const num = Number(value);
  if (!Number.isFinite(num)) return String(value);
  if (num >= 10000) return `$${num.toLocaleString('en-US')}`;
  return `$${num.toFixed(2).replace(/\.00$/, '')}`;
}

function merchantCategory(categoryCn) {
  const raw = String(categoryCn || '');
  if (raw.includes('餐') || raw.includes('奶茶')) return '美食';
  if (raw.includes('自行车') || raw.includes('美术') || raw.includes('房产') || raw.includes('美容') || raw.includes('美甲')) return '生活';
  return '生活';
}

function productCategory(store, product) {
  const text = `${store.category_cn || ''} ${product.name_cn || ''}`;
  if (text.includes('奶茶') || text.includes('鲜奶')) return '奶茶';
  if (text.includes('绿茶') || text.includes('乌龙') || text.includes('百香果') || text.includes('芒果') || text.includes('草莓')) return '水果茶';
  if (text.includes('冰沙')) return '冷饮';
  if (text.includes('房') || text.includes('公寓') || text.includes('住宅') || text.includes('别墅') || text.includes('铺面')) return '房源';
  return store.category_cn || '商品';
}

function normalizeStore(dirPath) {
  const store = readJson(path.join(dirPath, 'store.json'));
  const email = store.email || store.owner_email || store.login_email || store.account_email;
  if (!email) throw new Error(`${store.folder || path.basename(dirPath)} missing email`);

  const logoPath = path.join(dirPath, store.logo || 'logo.png');
  const logo = dataUrl(logoPath);
  const products = (store.products || []).map((p) => ({
    id: p.id || `p_${Date.now()}`,
    name: p.name_cn || p.name_en || '未命名商品',
    name_en: p.name_en || '',
    category: productCategory(store, p),
    price: moneyText(p.price),
    description: p.description_cn || p.description_en || '',
    description_en: p.description_en || '',
    image: dataUrl(path.join(dirPath, p.image || '')),
    active: true
  }));
  const coupons = (store.promotions || []).map((promo) => ({
    id: promo.id || `c_${Date.now()}`,
    title: promo.title_cn || promo.title_en || '优惠券',
    title_en: promo.title_en || '',
    description: promo.description_cn || promo.description_en || '',
    description_en: promo.description_en || '',
    badge: '优惠',
    active: true,
    image: ''
  }));
  const benefits = store.membership && Array.isArray(store.membership.benefits_cn)
    ? store.membership.benefits_cn
    : [];

  return {
    email,
    password: PASSWORD,
    profile: {
      name: store.name_cn || store.name_en || email.split('@')[0],
      avatar: logo || null,
      bio: store.description_cn || store.description_en || '',
      tags: [store.category_cn, store.category_en].filter(Boolean)
    },
    merchant: {
      slug: store.store_id,
      business_name: store.name_cn || store.name_en,
      category: merchantCategory(store.category_cn),
      subcategory: store.category_cn || store.category_en || '',
      address: store.address_cn || store.address_en || '',
      phone: store.phone || '',
      business_hours: store.business_hours || '',
      intro: store.description_cn || store.description_en || '',
      website_url: '',
      external_links: [],
      microsite_enabled: true,
      microsite_title: store.name_cn || store.name_en || '',
      seo_description: store.description_cn || store.description_en || '',
      perks: benefits.slice(0, 4),
      loyalty_target: 8,
      loyalty_reward: benefits[0] || '会员专属优惠',
      logo: logo || null,
      cover_image: logo || null,
      products,
      coupons,
      verified: true,
      verified_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  };
}

async function api(pathname, options = {}) {
  const res = await fetch(`${SUPABASE_URL}${pathname}`, {
    ...options,
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(options.headers || {})
    }
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch (_) { data = text; }
  if (!res.ok) {
    const err = new Error(typeof data === 'string' ? data : JSON.stringify(data));
    err.status = res.status;
    throw err;
  }
  return data;
}

async function findUserByEmail(email) {
  const data = await api('/auth/v1/admin/users?per_page=1000');
  const users = data && Array.isArray(data.users) ? data.users : [];
  return users.find((u) => String(u.email || '').toLowerCase() === email.toLowerCase()) || null;
}

async function createOrFindUser(store) {
  const existing = await findUserByEmail(store.email);
  if (existing) return existing;
  return api('/auth/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify({
      email: store.email,
      password: store.password,
      email_confirm: true,
      user_metadata: { name: store.profile.name, role: 'merchant' },
      app_metadata: { role: 'merchant' }
    })
  });
}

async function upsertByUserId(table, userId, payload) {
  const existing = await api(`/rest/v1/${table}?user_id=eq.${encodeURIComponent(userId)}&select=user_id&limit=1`);
  if (Array.isArray(existing) && existing.length) {
    return api(`/rest/v1/${table}?user_id=eq.${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }
  return api(`/rest/v1/${table}`, {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, ...payload })
  });
}

async function main() {
  const dirs = fs.readdirSync(SOURCE_DIR)
    .filter((name) => !name.startsWith('.') && fs.statSync(path.join(SOURCE_DIR, name)).isDirectory())
    .sort();
  const stores = dirs.map((dir) => normalizeStore(path.join(SOURCE_DIR, dir)));

  console.log(`Found ${stores.length} mock merchants.`);
  stores.forEach((store) => {
    console.log(`- ${store.merchant.business_name} <${store.email}> products=${store.merchant.products.length} coupons=${store.merchant.coupons.length}`);
  });

  if (dryRun) {
    console.log('Dry run only. No Supabase changes were made.');
    return;
  }

  for (const store of stores) {
    console.log(`\nImporting ${store.merchant.business_name} <${store.email}>`);
    const user = await createOrFindUser(store);
    const userId = user.id;
    await upsertByUserId('profiles', userId, store.profile);
    await upsertByUserId('merchants', userId, store.merchant);
    console.log(`Done: ${store.merchant.business_name} user_id=${userId}`);
  }
  console.log('\nAll mock merchants imported.');
}

main().catch((err) => {
  console.error('Import failed:', err.message);
  process.exit(1);
});
