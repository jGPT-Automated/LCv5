#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const nativeControls = new Set(['Text', 'Button', 'Pressable', 'TouchableOpacity',
  'TouchableHighlight', 'TouchableWithoutFeedback', 'TouchableNativeFeedback',
  'Switch', 'Modal', 'TextInput']);
const adapters = {
  'src/components/ui/Text.tsx': new Set(['Text']),
  'src/components/ui/controls.tsx': new Set(['Pressable']),
  'src/components/ui/Sheet.tsx': new Set(['Pressable']),
  'src/components/nav/TabBar.tsx': new Set(['Pressable']),
};
const textIdentity = new Set(['fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'textTransform']);

/** Structural guard only; layout quality and rendered behavior need review. */
export function inspectSource(filename, source) {
  const file = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const issues = [];
  const legacyPressables = new Set();
  let legacyUses = 0;
  const theme = filename.startsWith('src/theme/');
  const report = (node, message) => {
    const line = file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1;
    issues.push(`${filename}:${line} ${message}`);
  };
  function visit(node) {
    if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === 'react-native') {
      const clause = node.importClause;
      if (clause && !clause.isTypeOnly) {
        if (clause.name || (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings))) {
          report(node, 'Use named React Native imports so shared-control ownership can be checked.');
        }
        if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
          for (const specifier of clause.namedBindings.elements) {
            if (specifier.isTypeOnly) continue;
            const original = (specifier.propertyName ?? specifier.name).text;
            if (!nativeControls.has(original)) continue;
            if (filename === 'src/features/home/HomeScreen.tsx' && original === 'Pressable') {
              legacyPressables.add(specifier.name.text);
            } else if (!adapters[filename]?.has(original)) {
              report(specifier, `Reuse the LC+ shared component instead of importing native ${original}. New adapters require a documented contract change.`);
            }
          }
        }
      }
    }
    if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
        legacyPressables.has(node.tagName.getText(file))) legacyUses++;
    if (!theme && filename !== 'src/components/ui/Text.tsx' && ts.isPropertyAssignment(node)) {
      const name = ts.isIdentifier(node.name) || ts.isStringLiteral(node.name) ? node.name.text : '';
      if (textIdentity.has(name)) report(node, `Typography identity (${name}) belongs to shared Text and the theme; use its props.`);
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  // Existing carousel-dot and menu-backdrop uses are audit debt, not a general exemption.
  if (legacyUses > 2) issues.push(`${filename}: native Pressable use grew beyond the 2 existing Home exceptions; reuse Tap.`);
  return issues;
}

export function checkTree(root) {
  const issues = [];
  let count = 0;
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.[jt]sx?$/.test(entry.name)) {
        count++;
        issues.push(...inspectSource(path.relative(root, full).split(path.sep).join('/'), fs.readFileSync(full, 'utf8')));
      }
    }
  }
  walk(path.join(root, 'src'));
  return { issues, count };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const { issues, count } = checkTree(root);
  if (issues.length) {
    console.error(`Design-system check failed (${issues.length}):\n${issues.join('\n')}`);
    process.exitCode = 1;
  } else console.log(`Design-system check passed (${count} files).`);
}
