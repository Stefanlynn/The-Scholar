#!/bin/bash
set -e

echo "Starting Netlify build process - FILESYSTEM FIX v7..."

# Clean any previous builds to force complete rebuild
echo "Cleaning previous builds..."
rm -rf .netlify dist node_modules/.cache

# Build the frontend
echo "Building frontend with Vite..."
NODE_ENV=production npx vite build --mode production

# Build the Netlify functions with forced rebuild
echo "Building serverless functions with filesystem fixes..."
mkdir -p .netlify/functions-internal
npx esbuild netlify/functions/api.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outdir=.netlify/functions-internal \
  --target=node18 \
  --external:@neondatabase/serverless \
  --external:drizzle-orm \
  --define:process.env.FORCE_REBUILD='"v7"'

echo "✓ Build complete for Netlify deployment with filesystem fixes"