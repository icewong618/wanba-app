import fs from 'node:fs';

const file = process.argv[2] || 'shared/app-main.js';
const source = fs.readFileSync(file, 'utf8');
const starts = [];
const declaration = /^function\s+([A-Za-z_$][\w$]*)\s*\(/gm;

function skipString(text, index, quote){
  let cursor = index + 1;
  while(cursor < text.length){
    if(text[cursor] === '\\'){ cursor += 2; continue; }
    if(text[cursor] === quote) return cursor + 1;
    cursor += 1;
  }
  return cursor;
}

function findBodyEnd(text, start){
  let cursor = start;
  let depth = 0;
  while(cursor < text.length){
    const char = text[cursor];
    // Global function bodies contain many nested template literals. Counting
    // every brace is intentional: template expressions are balanced too.
    if(char === '{') depth += 1;
    if(char === '}'){
      depth -= 1;
      if(depth === 0) return cursor;
    }
    cursor += 1;
  }
  return -1;
}

for(const match of source.matchAll(declaration)){
  const bodyStart = source.indexOf('{', match.index);
  const bodyEnd = findBodyEnd(source, bodyStart);
  if(bodyStart < 0 || bodyEnd < 0) throw new Error(`Unable to parse function ${match[1]}`);
  starts.push({ name:match[1], start:match.index, end:bodyEnd + 1 });
}

const grouped = new Map();
starts.forEach(entry => grouped.set(entry.name, [...(grouped.get(entry.name) || []), entry]));
const obsolete = [...grouped.values()].flatMap(entries => entries.slice(0, -1));
if(!obsolete.length){ console.log('No overridden global functions found.'); process.exit(0); }

let cleaned = source;
for(const entry of obsolete.sort((a, b) => b.start - a.start)){
  cleaned = `${cleaned.slice(0, entry.start)}/* Removed overridden ${entry.name} implementation during v5.510 cleanup. */\n${cleaned.slice(entry.end)}`;
}
fs.writeFileSync(file, cleaned);
console.log(`Removed ${obsolete.length} overridden function implementations from ${file}.`);
