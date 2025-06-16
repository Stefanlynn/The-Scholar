#!/bin/bash

# Build the frontend
npm run build:frontend

# Build the Netlify functions
npm run build:functions

echo "Build complete for Netlify deployment"