#!/usr/bin/env node
/**
 * Fails if code outside src/theme uses a raw color or a raw number for
 * spacing, radius or font size. Use tokens from '@/theme' instead.
 *
 * Allowed: 0, negative tokens (e.g. -space.s), and any line ending with
 * `// tokens-ok: <reason>` for the rare justified exception.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'src');
const SKIP = [path.join(root, 'theme')];

const COLOR = /['"`](#[0-9a-fA-F]{3,8}|rgba?\()/;
const SIZED =
  /\b(padding|paddingTop|paddingBottom|paddingLeft|paddingRight|paddingHorizontal|paddingVertical|margin|marginTop|marginBottom|marginLeft|marginRight|marginHorizontal|marginVertical|gap|rowGap|columnGap|borderRadius|borderTopLeftRadius|borderTopRightRadius|borderBottomLeftRadius|borderBottomRightRadius|fontSize)\s*:\s*-?(\d+(\.\d+)?)\b/g;

const files = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (SKIP.some((s) => p.startsWith(s))) continue;
    if (e.isDirectory()) walk(p);
    else if (/\.(tsx?|jsx?)$/.test(e.name)) files.push(p);
  }
})(root);

const problems = [];
for (const f of files) {
  fs.readFileSync(f, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      if (/\/\/ tokens-ok:/.test(line)) return;
      const where = `${path.relative(path.dirname(root), f)}:${i + 1}`;
      if (COLOR.test(line)) problems.push(`${where}  raw color → use color.* / tier.* / sport.*`);
      for (const m of line.matchAll(SIZED)) {
        if (Number(m[2]) !== 0) problems.push(`${where}  ${m[1]}: ${m[2]} → use space.* / radius.* / a type size`);
      }
    });
}

if (problems.length) {
  console.error(`Token check failed (${problems.length}):\n` + problems.join('\n'));
  process.exit(1);
}
console.log(`Token check passed (${files.length} files).`);
