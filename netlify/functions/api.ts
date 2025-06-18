import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { registerRoutes } from '../../server/routes';

// Set serverless environment flag early
process.env.NETLIFY = 'true';

// Force rebuild with inline multer storage - June 18, 2025 v5

// Create app instance
const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: true,
  credentials: true
}));

// Parse JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Initialize routes
let routesInitialized = false;
const initializeRoutes = async () => {
  if (!routesInitialized) {
    await registerRoutes(app);
    routesInitialized = true;
  }
};

// Create serverless handler
const serverlessHandler = serverless(app);

// Export the Netlify handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  try {
    // Set NETLIFY environment variable for serverless detection
    process.env.NETLIFY = 'true';
    
    // Initialize routes on first request
    await initializeRoutes();
    
    // Process the request
    const result = await serverlessHandler(event, context) as any;
    return result;
  } catch (error) {
    console.error('Handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};