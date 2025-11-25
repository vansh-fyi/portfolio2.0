// backend/src/local-server.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from './api/index';
import http from 'http';

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Health check
  if (req.url === '/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ status: 'OK' }));
    return;
  }

  // Handle tRPC requests at /api/trpc/*
  if (req.url?.startsWith('/api/trpc')) {
    try {
      // Convert Node.js request to Fetch API Request
      const url = `http://localhost:${PORT}${req.url}`;
      const body = await new Promise<string>((resolve) => {
        if (req.method === 'GET' || req.method === 'HEAD') {
          resolve('');
          return;
        }
        let data = '';
        req.on('data', chunk => data += chunk);
        req.on('end', () => resolve(data));
      });

      const fetchReq = new Request(url, {
        method: req.method || 'GET',
        headers: req.headers as any,
        body: body || undefined,
      });

      // Handle with tRPC fetch adapter
      const response = await fetchRequestHandler({
        endpoint: '/api/trpc',
        req: fetchReq,
        router: appRouter,
        createContext: () => ({}),
      });

      // Convert Fetch API Response to Node.js response
      res.statusCode = response.status;
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      const responseBody = await response.text();
      res.end(responseBody);
    } catch (error) {
      console.error('[tRPC] Error:', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  } else {
    // 404 for other paths
    res.statusCode = 404;
    res.end('Not Found');
  }
});

console.log(`Local tRPC server listening on http://localhost:${PORT}`);
server.listen(PORT);
