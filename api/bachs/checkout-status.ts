import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleGetCheckoutStatus } from '../_lib/bachsServer.js';

export default async function handler(
  req: IncomingMessage & { query?: Record<string, string | string[]> },
  res: ServerResponse
) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }));
    return;
  }

  const url = new URL(req.url || '/', 'http://localhost');
  const checkout_id =
    (typeof req.query?.checkout_id === 'string' ? req.query.checkout_id : undefined) ??
    url.searchParams.get('checkout_id') ??
    undefined;
  const project_id =
    (typeof req.query?.project_id === 'string' ? req.query.project_id : undefined) ??
    url.searchParams.get('project_id') ??
    undefined;

  const result = await handleGetCheckoutStatus({ checkout_id, project_id });
  res.statusCode = result.status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result.body));
}
