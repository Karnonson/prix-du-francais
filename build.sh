#!/usr/bin/env sh
# index.html is written as a page body, the way Claude Artifacts publish it.
# This wraps it into a full document in dist/ for any other static host (GitHub Pages, Netlify…).
set -eu
cd "$(dirname "$0")"
mkdir -p dist
{
  printf '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
  printf '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
  printf '<style>body{margin:0}img{max-width:100%%}</style>\n</head>\n<body>\n'
  cat index.html
  printf '\n</body>\n</html>\n'
} > dist/index.html
echo "dist/index.html"
