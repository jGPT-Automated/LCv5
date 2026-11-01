#!/usr/bin/env node
/**
 * Enforces docs/DESIGN.md in screen code (src/screens and src/app).
 * Screens are assembled from shared components; they don't draw their own
 * frame, type, radius or sizes. Fails CI on any violation.
 *
 * A line ending in `// design-ok: <reason>` is exempt. Use it rarely and
 * log the reason in docs/DECISIONS.md.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'src');
const DIRS = ['screens', 'app'].map((d) => path.join(root, d));

const BANNED_RN = ['ScrollView', 'FlatList', 'SectionList', 'Text', 'Pressable', 'TouchableOpacity', 'Switch', 'TextInput', 'SafeAreaView', 'StyleSheet'];
const STYLE_KEYS = /\b(borderRadius|borderTopLeftRadius|borderTopRightRadius|fontSize|fontFamily|fontWeight|letterSpacing|boxShadow)\s*:/;
const RAW_SIZE = /\b(height|minHeight|maxHeight|width|minWidth)\s*:\s*[1-9]/;
const TEXT_SIZE = /<Text\b[^>]*?\b(size|variant)=/s;

// Layout belongs in shared components. Screens may not add their own flex,
// gap, padding or margin. Files that predate this rule have a count in
// scripts/design-layout-baseline.json that can only go down; a file not in it
// must have none.
const LAYOUT = /\b(flexDirection|justifyContent|alignItems|gap|padding\w*|margin\w*)\s*:/;
const baselinePath = path.join(path.dirname(new URL(import.meta.url).pathname), 'design-layout-baseline.json');
const baseline = fs.existsSync(baselinePath) ? JSON.parse(fs.readFileSync(baselinePath, 'utf8')) : {};
const writeBaseline = process.argv.includes('--write-baseline');
const counts = {};

const files = [];
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.tsx?$/.test(e.name)) files.push(p);
  }
}
DIRS.forEach(walk);

const problems = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const rel = path.relative(path.dirname(root), f);
  const lines = src.split('\n');

  // React Native primitives screens must not use directly.
  for (const m of src.matchAll(/import\s*\{([^}]*)\}\s*from\s*'react-native'/g)) {
    const names = m[1]
      .split(',')
      .map((s) => s.trim().replace(/^type\s+/, ''))
      .filter(Boolean);
    const isTypeOnly = (n) => m[1].includes('type ' + n);
    for (const n of names)
      if (BANNED_RN.includes(n) && !isTypeOnly(n)) problems.push(`${rel}  imports ${n} from react-native → use the shared component (DESIGN.md, Components)`);
  }
  if (/useSafeAreaInsets/.test(src)) problems.push(`${rel}  uses useSafeAreaInsets → only Page handles insets`);
  if (/Screen\.tsx$/.test(f)) {
    if (!/<(Page|FlowPage)\b/.test(src)) problems.push(`${rel}  screen doesn't render <Page> or <FlowPage> → every screen uses a shared page frame`);
  }
  for (const m of src.matchAll(new RegExp(TEXT_SIZE, 'gs'))) {
    const line = src.slice(0, m.index).split('\n').length;
    if (!/design-ok:/.test(lines[line - 1])) problems.push(`${rel}:${line}  <Text> with size/variant → use t="…" (DESIGN.md, Type)`);
  }
  counts[rel] = lines.filter((l) => !/design-ok:/.test(l) && LAYOUT.test(l)).length;
  lines.forEach((l, i) => {
    if (/design-ok:/.test(l)) return;
    const where = `${rel}:${i + 1}`;
    const k = l.match(STYLE_KEYS);
    if (k) problems.push(`${where}  ${k[1]} in a screen → use a shared component`);
    const s = l.match(RAW_SIZE);
    if (s) problems.push(`${where}  numeric ${s[1]} → use a size token`);
  });
}

if (writeBaseline) {
  const out = Object.fromEntries(Object.entries(counts).filter(([, n]) => n > 0).sort());
  fs.writeFileSync(baselinePath, JSON.stringify(out, null, 2) + '\n');
  console.log('Wrote layout baseline for ' + Object.keys(out).length + ' files.');
  process.exit(0);
}
for (const [rel, n] of Object.entries(counts)) {
  const allowed = baseline[rel] ?? 0;
  if (n > allowed) problems.push(`${rel}  ${n} layout style lines (flex/gap/padding/margin), allowed ${allowed} → build the layout from shared components (Section, Row, PageFixed, StatusCard…)`);
}
if (problems.length) {
  console.error(`Design check failed (${problems.length}):\n` + problems.join('\n'));
  process.exit(1);
}
console.log(`Design check passed (${files.length} files).`);
