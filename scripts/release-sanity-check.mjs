import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const entries = ['index.html', 'app.html'];
const requiredModules = [
  'shared/module-runtime.js',
  'shared/app-shell.css',
  'shared/app-main.js',
  'shared/app-navigation.js',
  'shared/supabase-client.js',
  'shared/profile-api.js',
  'shared/post-api.js',
  'shared/engagement-api.js',
  'shared/merchant-public-api.js',
  'shared/merchant-analytics-api.js',
  'shared/merchant-coupon-api.js',
  'shared/restaurant-order-api.js',
  'shared/restaurant-data-api.js',
  'shared/rental-api.js',
  'shared/auto-sales-api.js'
];

const fail = message => {
  console.error(`FAIL ${message}`);
  process.exitCode = 1;
};

const read = file => fs.readFileSync(path.join(root, file), 'utf8');

try {
  const [indexHtml, appHtml] = entries.map(read);
  if(indexHtml !== appHtml) fail('index.html and app.html are not synchronized');
  else console.log('PASS entry pages are synchronized');

  const manifest = JSON.parse(read('version.json'));
  const version = String(manifest.version || '').trim();
  if(!/^\d+\.\d+(?:[a-z])?$/i.test(version)) fail('version.json contains an invalid version');
  else console.log(`PASS version manifest ${version}`);

  const splitStyles = ['shared/styles/base.css', 'shared/styles/mobile-safe.css', 'shared/styles/merchant.css'];
  const missingStyles = splitStyles.filter(file => !fs.existsSync(path.join(root, file)));
  if(missingStyles.length) fail(`split style layers missing: ${missingStyles.join(', ')}`);
  else if(!read('shared/app-shell.css').includes('./styles/base.css')) fail('app shell CSS does not load split style layers');
  else console.log(`PASS ${splitStyles.length} split style layers exist`);

  for(const entry of entries){
    const html = read(entry);
    const declared = read('shared/app-main.js').match(/const APP_VERSION = '([^']+)'/);
    if(!declared || declared[1] !== version) fail(`${entry} does not match version.json`);

    let scriptIndex = 0;
    for(const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)){
      const content = match[1].trim();
      if(!content) continue;
      new vm.Script(content, { filename: `${entry}:inline-${scriptIndex}` });
      scriptIndex += 1;
    }

    const localSources = [...html.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)]
      .map(match => match[1].split('?')[0])
      .filter(source => source.startsWith('./'));
    const missing = localSources.filter(source => !fs.existsSync(path.join(root, source.slice(2))));
    if(missing.length) fail(`${entry} references missing modules: ${missing.join(', ')}`);
    else {
      for(const source of localSources.filter(source => source.endsWith('.js'))){
        new vm.Script(read(source.slice(2)), { filename: `${entry}:${source}` });
      }
      console.log(`PASS ${entry} scripts and inline code`);
    }

    const mainController = read('shared/app-main.js');
    const configOffset = mainController.indexOf('const SUPABASE_URL');
    const initializationOffset = mainController.indexOf('const authSessionStore');
    if(configOffset < 0 || initializationOffset < 0 || configOffset > initializationOffset){
      fail(`${entry} main controller initializes Supabase-dependent modules before configuration`);
    }
    const functionNames = [...mainController.matchAll(/^function\s+([A-Za-z_$][\w$]*)\s*\(/gm)].map(match => match[1]);
    const duplicateFunctions = [...new Set(functionNames.filter((name, index) => functionNames.indexOf(name) !== index))];
    if(duplicateFunctions.length) fail(`${entry} contains overridden global functions: ${duplicateFunctions.join(', ')}`);
  }

  const missingModules = requiredModules.filter(file => !fs.existsSync(path.join(root, file)));
  if(missingModules.length) fail(`required shared modules missing: ${missingModules.join(', ')}`);
  else console.log(`PASS ${requiredModules.length} required shared modules exist`);

  const pullRefresh = read('shared/app-pull-refresh.js');
  if(/\bpreventDefault\s*\(/.test(pullRefresh) || /touchmove[\s\S]{0,900}passive\s*:\s*false/.test(pullRefresh)){
    fail('pull-to-refresh blocks native vertical scrolling');
  } else if(!pullRefresh.includes('holdReady') || !pullRefresh.includes('保持一下')){
    fail('pull-to-refresh hold-to-refresh state is missing');
  } else {
    console.log('PASS pull-to-refresh preserves native vertical scrolling');
  }
} catch(error) {
  fail(error.stack || error.message);
}

if(!process.exitCode) console.log('Release sanity check passed.');
