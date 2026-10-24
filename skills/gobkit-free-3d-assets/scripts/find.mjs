#!/usr/bin/env node
// List free Gobkit models that match some words: node find.mjs <words...>   (Node 18+, no packages)
// Every word must appear in the model name, its pack name, the pack kind or a clip name (case does not matter).
// GOBKIT_MANIFEST may point to a saved copy of the manifest (a file path) instead of the live URL.
import { readFileSync } from 'node:fs';

const SRC = process.env.GOBKIT_MANIFEST || 'https://gobkit.com/api/free';
const words = process.argv.slice(2).map((w) => w.toLowerCase());
const data = /^https?:/.test(SRC) ? await (await fetch(SRC)).json() : JSON.parse(readFileSync(SRC, 'utf8'));

const rows = [];
for (const pack of data.packs || []) {
  for (const m of pack.models || []) {
    const clips = (m.animations || pack.animations || []).map((a) => (typeof a === 'string' ? a : a.name)).filter(Boolean);
    const hay = [m.name, m.id, pack.name, pack.kind, ...clips].join(' ').toLowerCase();
    if (words.every((w) => hay.includes(w))) rows.push({ name: m.name, pack: pack.name, rigged: !!(m.rigged ?? pack.rigged), clips, url: m.url });
  }
}
if (!rows.length) { console.log(`No match for "${words.join(' ')}". Try fewer or other words; ${data.totalFreeModels ?? '?'} models in total.`); process.exit(1); }
for (const r of rows) console.log(JSON.stringify(r));
console.log(`${rows.length} match(es) · CC0 · use each url as given`);
