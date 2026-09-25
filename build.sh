#!/usr/bin/env bash
#
# Assemble the Cloudflare Pages publish directory.
#
#   /            -> landing/  (marketing + email signup)
#   /app/        -> app/      (the app, hash-routed static)
#
# No toolchain: plain copy + a generated _headers / robots.txt. Output: dist/
#
set -euo pipefail
cd "$(dirname "$0")"

rm -rf dist
mkdir -p dist/app

# --- landing page at the root ---
cp landing/index.html landing/app.js landing/styles.css dist/

# --- prototype under /app/ ---
cp -r app/. dist/app/
rm -f dist/app/README.md

# --- headers -----------------------------------------------------------------
# Rule order matters: Cloudflare Pages merges all matching rules and, for a
# repeated header, the LAST matching rule wins. So the site-wide block comes
# first and the /app/* block overrides CSP for the prototype (which injects
# inline style="" attributes and therefore needs style-src 'unsafe-inline').
cp landing/_headers dist/_headers
cat >> dist/_headers <<'EOF'

/app/*
  ! Content-Security-Policy
  Content-Security-Policy: default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://aifaculty-api.lecheyne24.workers.dev; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; object-src 'none'
EOF

# --- robots.txt: /app is public, so nothing is disallowed here. This file is still emitted
# because without it Pages falls back to serving index.html for /robots.txt, which is not a
# valid robots file at all.
cat > dist/robots.txt <<'EOF'
User-agent: *
Allow: /
EOF

# --- www -> apex (takes effect once the www DNS record + Pages domain are live) ---
cat > dist/_redirects <<'EOF'
https://www.aifaculty.org/* https://aifaculty.org/:splat 301
EOF

echo "built dist/ ->"
find dist -type f | sort | sed 's/^/  /'
