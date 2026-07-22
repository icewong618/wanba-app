import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const output = path.join(root, '_site');
const rootFiles = ['index.html', 'app.html', '404.html', 'version.json', 'CNAME', '.nojekyll'];
const directories = ['assets', 'shared', 'i18n', 'deals', 'week', 'messages', 'restaurant', 'rental', 'autos', 'merchant', 'order', 'vendor'];

const copy = source => {
  const sourcePath = path.join(root, source);
  if(!fs.existsSync(sourcePath)) return;
  fs.cpSync(sourcePath, path.join(output, source), { recursive:true });
};

const walkFiles = directory => {
  if(!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes:true }).flatMap(entry => {
    const item = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(item) : [item];
  });
};

const minifyCss = source => source
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,>])\s*/g, '$1')
  .replace(/;}\s*/g, '}')
  .trim();

const minifyHtml = source => source
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/>\s+</g, '><')
  .trim();

fs.rmSync(output, { recursive:true, force:true });
fs.mkdirSync(output, { recursive:true });
rootFiles.forEach(copy);
directories.forEach(copy);

const entry = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
const appEntry = fs.readFileSync(path.join(output, 'app.html'), 'utf8');
if(entry !== appEntry) throw new Error('Deployed index.html and app.html are not synchronized');
if(!entry.includes('./shared/app-shell.css') || !entry.includes('./shared/app-main.js')){
  throw new Error('Deployed entry page does not reference split app assets');
}
new vm.Script(fs.readFileSync(path.join(output, 'shared', 'app-main.js'), 'utf8'), { filename:'_site/shared/app-main.js' });
const moduleSources = [...entry.matchAll(/<(?:script|link)[^>]+(?:src|href)="\.\/([^"?]+)[^"]*"/g)]
  .map(match => match[1])
  .filter(source => /\.(?:js|css)$/.test(source));
const missing = moduleSources.filter(source => !fs.existsSync(path.join(output, source)));

if(missing.length){
  console.error(`Missing deployed modules: ${missing.join(', ')}`);
  process.exit(1);
}

const cssFiles = walkFiles(output).filter(file => file.endsWith('.css'));
const cssImportMissing = [];
for(const cssFile of cssFiles){
  const css = fs.readFileSync(cssFile, 'utf8');
  for(const match of css.matchAll(/@import\s+url\(["']?([^"')?]+)[^)]*\)/g)){
    const reference = match[1];
    if(!reference.startsWith('.')) continue;
    if(!fs.existsSync(path.resolve(path.dirname(cssFile), reference))) cssImportMissing.push(`${path.relative(output, cssFile)} -> ${reference}`);
  }
}
if(cssImportMissing.length){
  console.error(`Missing CSS imports: ${cssImportMissing.join(', ')}`);
  process.exit(1);
}

const optimized = [];
for(const file of walkFiles(output)){
  if(file.endsWith('.css')){
    fs.writeFileSync(file, minifyCss(fs.readFileSync(file, 'utf8')));
    optimized.push(path.relative(output, file));
  }
  if(file.endsWith('.html')){
    fs.writeFileSync(file, minifyHtml(fs.readFileSync(file, 'utf8')));
    optimized.push(path.relative(output, file));
  }
}
fs.writeFileSync(path.join(output, 'build-meta.json'), JSON.stringify({
  version: JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8')).version,
  built_at: new Date().toISOString(),
  optimized_files: optimized.length
}, null, 2));

console.log(`Pages site built: ${rootFiles.length} root files, ${directories.length} module directories.`);
console.log(`Included split app shell and main controller assets.`);
console.log(`Verified ${moduleSources.length} entry module references.`);
console.log(`Optimized ${optimized.length} HTML/CSS production assets.`);
