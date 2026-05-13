/**
 * UploadThing API Route Handler
 * 
 * @description Alternative file upload service integration using UploadThing.
 * Provides a simpler file upload solution with built-in React components.
 * 
 * @routes
 * - GET /api/uploadthing - UploadThing metadata and configuration
 * - POST /api/uploadthing - File upload endpoint
 * 
 * @features
 * - Simplified file upload flow
 * - Built-in file validation
 * - Automatic file type checking
 * - Progress tracking support
 * - Configurable file size limits
 * 
 * @see ./core.ts for UploadThing file router configuration
 */
import { createRouteHandler } from 'uploadthing/next';
import { ourFileRouter } from './core';

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
