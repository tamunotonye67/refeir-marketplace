import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleCreateConnectedAccount, handleGetConnectedAccount } from '../../_lib/bachsServer.js';

async function readJsonBody(req: IncomingMessage & { body?: unknown }): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, unknown>;
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
}

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    const url = new URL(req.url || '/', 'http://localhost');
    const result = await handleGetConnectedAccount({
      user_id: url.searchParams.get('user_id') || undefined,
      account_id: url.searchParams.get('account_id') || undefined,
      refresh: url.searchParams.get('refresh') || undefined
    });
    res.statusCode = result.status;
    res.end(JSON.stringify(result.body));
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const result = await handleCreateConnectedAccount(body);
      res.statusCode = result.status;
      res.end(JSON.stringify(result.body));
    } catch (err) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'BAD_REQUEST', message: err instanceof Error ? err.message : 'Invalid JSON' }));
    }
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }));
}
