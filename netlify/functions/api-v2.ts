import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import serverless from "serverless-http";
import express from "express";

// Set serverless environment flag early
process.env.NETLIFY = 'true';

// NEW FUNCTION - No filesystem operations - June 18, 2025 v9

// Create app instance
const app = express();

// Import and register routes
import { registerRoutes } from "../../server/routes";

// Initialize the Express app with routes
registerRoutes(app);

// Create serverless handler
const handler = serverless(app, {
  binary: ["image/*", "application/pdf", "application/octet-stream"]
});

export { handler };