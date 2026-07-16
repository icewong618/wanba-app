/* One-time migration: Base64 media in Supabase rows -> Cloudflare R2 URLs. */
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const required = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'MEDIA_API_URL', 'MEDIA_MIGRATION_KEY'];
for (const name of required) {
  if (!process.env[name]) throw new Error(`Missing ${name}`);
}

const SUPABASE_URL = process.env.SUPABASE_URL.replace(/\/$/, '');
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MEDIA_API_URL = process.env.MEDIA_API_URL.replace(/\/$/, '');
const MIGRATION_KEY = process.env.MEDIA_MIGRATION_KEY;
const checkpoint = { startedAt: new Date().toISOString(), migrated: [], skipped: [], errors: [] };

function isDataImage(value) { return typeof value === 'string' && /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(value); }
function dataImage(value) {
  const match = String(value).match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/is);
  if (!match) throw new Error('Unsupported Base64 image');
  return { contentType: match[1] === 'image/jpg' ? 'image/jpeg' : match[1], body: Buffer.from(match[2], 'base64') };
}
function headers() { return { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }; }

async function readRows(table, select) {
  const result = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(select)}&limit=1000`, { headers: headers() });
  if (!result.ok) throw new Error(`${table} read failed: ${result.status} ${await result.text()}`);
  return result.json();
}
async function patchRow(table, key, value, payload) {
  const result = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${encodeURIComponent(key)}=eq.${encodeURIComponent(value)}`, {
    method: 'PATCH', headers: headers(), body: JSON.stringify(payload)
  });
  if (!result.ok) throw new Error(`${table}/${value} update failed: ${result.status} ${await result.text()}`);
}
async function upload(buffer, contentType, ownerId, kind) {
  const result = await fetch(`${MEDIA_API_URL}/migrate`, {
    method: 'POST',
    headers: { 'Content-Type': contentType, 'x-media-owner': ownerId, 'x-media-kind': kind, 'x-media-migration-key': MIGRATION_KEY },
    body: buffer
  });
  if (!result.ok) throw new Error(`R2 upload failed: ${result.status} ${await result.text()}`);
  return (await result.json()).url;
}
async function uploadDataUrl(value, ownerId, kind, thumbnail) {
  if (!isDataImage(value)) return value || null;
  const source = dataImage(value);
  if (!thumbnail) return upload(source.body, source.contentType, ownerId, kind);
  const thumb = await sharp(source.body).rotate().resize({ width: 480, withoutEnlargement: true }).jpeg({ quality: 72, mozjpeg: true }).toBuffer();
  return upload(thumb, 'image/jpeg', ownerId, kind);
}
async function migratePosts() {
  const rows = await readRows('posts', 'id,user_id,image,images,image_thumbnail,image_thumbnails');
  for (const row of rows) {
    const originals = Array.isArray(row.images) && row.images.length ? row.images : (row.image ? [row.image] : []);
    if (!originals.some(isDataImage)) continue;
    try {
      const imageUrls = [];
      const thumbnails = [];
      for (const value of originals) {
        imageUrls.push(await uploadDataUrl(value, row.user_id, 'posts', false));
        thumbnails.push(await uploadDataUrl(value, row.user_id, 'posts', true));
      }
      await patchRow('posts', 'id', row.id, { image: imageUrls[0] || null, images: imageUrls, image_thumbnail: thumbnails[0] || null, image_thumbnails: thumbnails });
      checkpoint.migrated.push({ table: 'posts', id: row.id, assets: imageUrls.length });
      console.log(`posts/${row.id}: migrated ${imageUrls.length} image(s)`);
    } catch (error) { checkpoint.errors.push({ table: 'posts', id: row.id, error: error.message }); console.error(`posts/${row.id}: ${error.message}`); }
  }
}
async function migrateProfileTable(table, key, fields, kindMap) {
  const rows = await readRows(table, [key, ...fields].join(','));
  for (const row of rows) {
    try {
      const patch = {};
      for (const field of fields) if (isDataImage(row[field])) patch[field] = await uploadDataUrl(row[field], row[key], kindMap[field], false);
      if (!Object.keys(patch).length) continue;
      await patchRow(table, key, row[key], patch);
      checkpoint.migrated.push({ table, id: row[key], fields: Object.keys(patch) });
      console.log(`${table}/${row[key]}: migrated ${Object.keys(patch).join(', ')}`);
    } catch (error) { checkpoint.errors.push({ table, id: row[key], error: error.message }); console.error(`${table}/${row[key]}: ${error.message}`); }
  }
}
async function main() {
  try {
    await migratePosts();
    await migrateProfileTable('profiles', 'user_id', ['avatar', 'cover'], { avatar: 'avatars', cover: 'covers' });
    await migrateProfileTable('merchants', 'user_id', ['logo', 'cover_image'], { logo: 'merchant-logos', cover_image: 'merchant-covers' });
  } finally {
    checkpoint.finishedAt = new Date().toISOString();
    fs.mkdirSync(path.join(process.cwd(), 'backup'), { recursive: true });
    const output = path.join(process.cwd(), 'backup', `media-migration-${Date.now()}.json`);
    fs.writeFileSync(output, JSON.stringify(checkpoint, null, 2));
    console.log(`Checkpoint: ${output}`);
    console.log(`Migrated: ${checkpoint.migrated.length}, errors: ${checkpoint.errors.length}`);
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
