#!/bin/bash

# Build the frontend using Vite
echo "Building frontend..."
npx vite build

# Build the Netlify functions
echo "Building serverless functions..."
npx esbuild netlify/functions/api.ts --platform=node --packages=external --bundle --format=esm --outdir=.netlify/functions-internal --target=node18

echo "Build complete for Netlify deployment"