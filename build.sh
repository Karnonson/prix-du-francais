#!/usr/bin/env sh
# index.html is written as a page body, the way Claude Artifacts publish it.
# This wraps it into a full document in dist/ for any other static host (GitHub Pages, Netlify…):
# the title, meta and font links before <style> go into <head>, the rest into <body>.
set -eu
cd "$(dirname "$0")"
mkdir -p dist
style=$(grep -n '^<style>' index.html | head -1 | cut -d: -f1)
{
  printf '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
  printf '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
  head -n "$((style - 1))" index.html
  printf '<style>body{margin:0}img{max-width:100%%}</style>\n</head>\n<body>\n'
  tail -n "+$style" index.html
  printf '\n</body>\n</html>\n'
} > dist/index.html
echo "dist/index.html"
# src/ is copied as it is: src/modules/x/y.js becomes dist/modules/x/y.js.
if [ -d src ]; then
  cp -R src/. dist/
fi
# Tests use Node's built-in runner (no dependency). SANS_TESTS=1 skips them.
if [ -z "${SANS_TESTS:-}" ]; then
  node --test "tests/**/*.test.js"
fi
