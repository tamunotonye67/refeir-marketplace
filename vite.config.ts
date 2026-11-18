import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import {
  handleCreateCheckoutSession,
  handleGetCheckoutStatus,
  handleBachsWebhook
} from './api/_lib/bachsServer';

function bachsLocalApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'bachs-local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlStr = req.url || '';
        if (!urlStr.startsWith('/api/bachs/')) {
          return next();
        }

        const parsedUrl = new URL(urlStr, 'http://localhost');
        const pathname = parsedUrl.pathname;

        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
        }
        const rawBody = Buffer.concat(chunks);

        const serverEnv = {
          BACHS_API_KEY: env.BACHS_API_KEY,
          BACHS_WEBHOOK_SECRET: env.BACHS_WEBHOOK_SECRET,
          SUPABASE_URL: env.SUPABASE_URL,
          SUPABASE_SERVICE_ROLE_KEY: env.SUPABASE_SERVICE_ROLE_KEY
        };

        try {
          if (pathname === '/api/bachs/checkout-sessions' && req.method === 'POST') {
            const body = rawBody.length ? JSON.parse(rawBody.toString('utf8')) : {};
            const result = await handleCreateCheckoutSession(body, serverEnv);
            res.statusCode = result.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result.body));
            return;
          }

          if (pathname === '/api/bachs/checkout-status' && req.method === 'GET') {
            const result = await handleGetCheckoutStatus(
              {
                checkout_id: parsedUrl.searchParams.get('checkout_id') || undefined,
                project_id: parsedUrl.searchParams.get('project_id') || undefined
              },
              serverEnv
            );
            res.statusCode = result.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result.body));
            return;
          }

          if (pathname === '/api/bachs/webhook' && req.method === 'POST') {
            const result = await handleBachsWebhook(rawBody, req.headers, serverEnv);
            res.statusCode = result.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result.body));
            return;
          }

          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'NOT_FOUND' }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              error: 'INTERNAL_ERROR',
              message: err instanceof Error ? err.message : 'Unexpected local API error'
            })
          );
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), bachsLocalApiPlugin(env)],
    server: {
      port: 3000,
      open: false
    }
  };
});
