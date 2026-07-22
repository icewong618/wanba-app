import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const shellPath = path.join(root, 'shared', 'app-shell.css');
const source = fs.readFileSync(shellPath, 'utf8');
if(source.includes('@import url("./styles/base.css")')){
  console.log('App shell CSS is already split.');
  process.exit(0);
}

function blocks(css){
  const result = [];
  let start = 0;
  let cursor = 0;
  while(cursor < css.length){
    if(css[cursor] === '/' && css[cursor + 1] === '*'){
      const close = css.indexOf('*/', cursor + 2);
      cursor = close < 0 ? css.length : close + 2;
      continue;
    }
    if(css[cursor] !== '{'){ cursor += 1; continue; }
    let depth = 1;
    let end = cursor + 1;
    while(end < css.length && depth){
      if(css[end] === '/' && css[end + 1] === '*'){
        const close = css.indexOf('*/', end + 2);
        end = close < 0 ? css.length : close + 2;
        continue;
      }
      if(css[end] === '{') depth += 1;
      if(css[end] === '}') depth -= 1;
      end += 1;
    }
    result.push(css.slice(start, end));
    start = end;
    cursor = end;
  }
  if(start < css.length) result.push(css.slice(start));
  return result;
}

const groups = { base:[], mobile:[], merchant:[] };
for(const block of blocks(source)){
  const open = block.indexOf('{');
  const header = (open < 0 ? block : block.slice(0, open)).toLowerCase();
  // Keep media queries intact in the base layer; their nested selectors can
  // cover multiple product areas and must preserve original cascade order.
  if(!header.includes('@media') && /merchant|merchant-|merchant_/.test(header)) groups.merchant.push(block);
  else if(!header.includes('@media') && /safe-area|app-bottom|overscroll|touch-action|100dvh|100svh/.test(block.toLowerCase())) groups.mobile.push(block);
  else groups.base.push(block);
}

const styles = path.join(root, 'shared', 'styles');
fs.mkdirSync(styles, { recursive:true });
fs.writeFileSync(path.join(styles, 'base.css'), groups.base.join(''));
fs.writeFileSync(path.join(styles, 'mobile-safe.css'), groups.mobile.join(''));
fs.writeFileSync(path.join(styles, 'merchant.css'), groups.merchant.join(''));
fs.writeFileSync(shellPath, `/* v5.510 application style entry point. */\n@import url("./styles/base.css");\n@import url("./styles/mobile-safe.css");\n@import url("./styles/merchant.css");\n`);
console.log(`Split app shell CSS: base ${groups.base.length}, mobile ${groups.mobile.length}, merchant ${groups.merchant.length}.`);
