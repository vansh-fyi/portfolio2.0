// backend/src/local-server.ts
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import { appRouter } from './api/index';
import cors from 'cors';
import http from 'http';

const PORT = 3000;

// Manually create server to have full control
const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.url === '/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'OK' }));
    return;
  }

  // Create a tRPC handler for this request
  const trpcHandler = createHTTPServer({
    router: appRouter,
    createContext: () => ({}),
  });
  
  // This is tricky with standalone adapter as it creates its own server.
  // Better approach: Use the standalone server but just don't try to hack the listener if it fails.
  // Let's revert to the simple standalone server without health check interception if it's causing issues,
  // OR use a standard http server and trpc's node-http adapter if available.
  // But we only have @trpc/server installed.
});

// RE-ATTEMPT: Use createHTTPServer standard usage, ignore health check for now if complex.
// OR better: just make a separate health check route in the router?
// tRPC router is at /api/trpc/* usually.
// Let's try adding a 'health' query to the router instead?
// BUT we need /health for general checks usually.

// Let's try the standard standalone server again, but simple.
const simpleServer = createHTTPServer({
  router: appRouter,
  createContext: () => ({}),
  middleware: cors(),
});

console.log(`Local tRPC server listening on http://localhost:${PORT}`);
simpleServer.listen(PORT);
