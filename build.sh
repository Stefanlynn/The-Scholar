#!/bin/bash
set -e

echo "Starting Netlify build process..."

# Build the frontend
echo "Building frontend with Vite..."
NODE_ENV=production npx vite build --mode production

# Build the Netlify functions
echo "Building serverless functions..."
mkdir -p .netlify/functions-internal
npx esbuild netlify/functions/api.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=.netlify/functions-internal \
  --target=node18 \
  --external:@neondatabase/serverless \
  --external:drizzle-orm

echo "✓ Build complete for Netlify deployment"