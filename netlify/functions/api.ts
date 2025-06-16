import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { registerRoutes } from '../../server/routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all routes
registerRoutes(app);

// Create serverless handler
const serverlessHandler = serverless(app);

// Export the Netlify handler
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const result = await serverlessHandler(event, context);
  return result;
};