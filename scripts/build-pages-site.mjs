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

console.log(`Pages site built: ${rootFiles.length} root files, ${directories.length} module directories.`);
console.log(`Included split app shell and main controller assets.`);
console.log(`Verified ${moduleSources.length} entry module references.`);
