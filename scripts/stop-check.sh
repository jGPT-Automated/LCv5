#!/usr/bin/env bash
# Stop hook: Claude can't finish until the design checks pass.
# Exit 2 sends the output back to Claude and keeps it working.
#   1. npm run check            typecheck, tokens, design (incl. no hand-coded layout)
#   2. build web + check-render screens render without repeated text, tiny text,
#                               content under the tab bar, or console errors
# Skips when nothing changed since the last pass. Gives up after 8 failed
# attempts in a row so it can't loop forever; it says so when it does.
cd "$(git rev-parse --show-toplevel)" || exit 0
state=.render-cache; mkdir -p "$state"
sig=$( (git diff HEAD; git ls-files -o --exclude-standard | xargs -r cat) 2>/dev/null | sha1sum | cut -d' ' -f1)
[ "$(cat $state/passed 2>/dev/null)" = "$sig" ] && exit 0
tries=$(cat $state/tries 2>/dev/null || echo 0)
fail() { echo $((tries + 1)) > $state/tries; { echo "CHECK FAILED (attempt $((tries + 1)) of 8). Fix this before you reply; the user sees nothing until it passes."; echo "$1"; } >&2; exit 2; }
if [ "$tries" -ge 8 ]; then rm -f $state/tries; echo "Checks still failing after 8 attempts; stopping so the loop ends. Tell the user exactly what is failing." >&2; exit 0; fi
out=$(npm run check 2>&1) || fail "$(echo "$out" | grep -v '^npm\|^$' | tail -25)"
if [ -n "$(git diff HEAD --name-only; git ls-files -o --exclude-standard)" ]; then
  out=$(npx expo export --platform web --output-dir $state/dist 2>&1) || fail "web build failed: $(echo "$out" | tail -15)"
  out=$(node scripts/check-render.mjs 2>&1) || fail "$out"
fi
echo "$sig" > $state/passed; rm -f $state/tries; exit 0
