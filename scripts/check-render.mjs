#!/usr/bin/env node
/**
 * Renders the main screens in a real browser (phone size) and fails on what a
 * person would see is wrong. Typecheck and lint can't see any of this.
 *
 *   - the same text shown twice near each other (or one text inside another)
 *   - text under 11px (Apple's minimum)
 *   - text hidden under the tab bar
 *   - console errors
 *
 * Findings that existed before this check are listed in
 * scripts/render-baseline.json and can only shrink. Anything new fails.
 * `--write-baseline` rewrites it; `--routes /a,/b` limits the routes.
 * Needs a web build in .render-cache/dist (the hook builds it).
 */
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const here = path.dirname(new URL(import.meta.url).pathname);
const dist = path.resolve(here, '..', '.render-cache', 'dist');
const baselinePath = path.join(here, 'render-baseline.json');
const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf8')) : {};
const arg = (n) => process.argv.includes(n) && process.argv[process.argv.indexOf(n) + 1];
const routes = (arg('--routes') || '/,/schedule,/compete,/explore,/me').split(',');
const VIEW = { width: 402, height: 874 };
const TAB_TOP = VIEW.height - 84;

const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.png': 'image/png', '.ttf': 'font/ttf', '.json': 'application/json', '.svg': 'image/svg+xml' };
const server = http
  .createServer((req, res) => {
    let p = path.join(dist, decodeURIComponent(req.url.split('?')[0]));
    if (!p.startsWith(dist) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) p = path.join(dist, 'index.html');
    res.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' });
    fs.createReadStream(p).pipe(res);
  })
  .listen(0);
await new Promise((r) => server.once('listening', r));
const base = 'http://localhost:' + server.address().port;

const browser = await chromium.launch();
const findings = {};
for (const route of routes) {
  const page = await (await browser.newContext({ viewport: VIEW })).newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const nodes = await page.evaluate(() => {
    const out = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = w.nextNode(); n; n = w.nextNode()) {
      const t = n.textContent.replace(/\s+/g, ' ').trim();
      if (!t) continue;
      const el = n.parentElement;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      const b = r.getBoundingClientRect();
      if (!b.width || !b.height) continue;
      out.push({ t, y: b.top, b: b.bottom, x: b.left, fs: parseFloat(cs.fontSize) });
    }
    return out;
  });
  const set = new Set();
  const low = (s) => s.toLowerCase();
  const long = nodes.filter((n) => n.t.length >= 4 && n.y < TAB_TOP);
  for (const n of nodes) {
    if (n.fs < 10.5) set.add(`text under 11px: "${n.t}" (${n.fs}px)`);
    if (n.y < TAB_TOP && n.b > TAB_TOP + 1) set.add(`under the tab bar: "${n.t}"`);
  }
  for (let i = 0; i < long.length; i++)
    for (let j = i + 1; j < long.length; j++) {
      const a = long[i], b = long[j];
      if (Math.abs(a.y - b.y) > 140) continue;
      const [x, y] = [low(a.t), low(b.t)];
      const word = (s, t) => new RegExp('(^|[^a-z0-9])' + s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)').test(t);
      if (x === y || word(x, y) || word(y, x)) set.add(`said twice: "${a.t}" and "${b.t}"`);
    }
  for (const e of new Set(errs)) set.add('console error: ' + e.slice(0, 120));
  findings[route] = [...set].sort();
  await page.context().close();
}
await browser.close();
server.close();

if (process.argv.includes('--write-baseline')) {
  fs.writeFileSync(baselinePath, JSON.stringify(Object.fromEntries(Object.entries(findings).filter(([, v]) => v.length)), null, 2) + '\n');
  console.log('Wrote render baseline.');
  process.exit(0);
}
const bad = [];
for (const [route, list] of Object.entries(findings)) for (const f of list) if (!(baseline[route] || []).includes(f)) bad.push(`${route}  ${f}`);
if (bad.length) {
  console.error(`Render check failed (${bad.length}):\n` + bad.join('\n'));
  process.exit(1);
}
console.log(`Render check passed (${routes.length} screens).`);
