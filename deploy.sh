#!/usr/bin/env sh
# Builds dist/ and force-pushes it as the gh-pages branch, which GitHub Pages serves.
set -eu
cd "$(dirname "$0")"
./build.sh >/dev/null
remote=$(git remote get-url origin)
source=$(git rev-parse --short HEAD)
cd dist
touch .nojekyll
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $source"
git push -q -f "$remote" gh-pages
rm -rf .git
echo "pushed gh-pages from $source"
