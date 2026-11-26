import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleGetAccountBalances } from '../../_lib/bachsServer.js';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }));
    return;
  }

  const url = new URL(req.url || '/', 'http://localhost');
  const result = await handleGetAccountBalances({
    account_id: url.searchParams.get('account_id') || undefined
  });
  res.statusCode = result.status;
  res.end(JSON.stringify(result.body));
}
