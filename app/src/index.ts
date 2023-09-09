import { Hono, Context, Next } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';

// Types
import { Env } from './schema/schema';

// Controllers
import { Get, BulkGet } from './controllers/get';
import { Upsert, BulkUpsert } from './controllers/upsert';
import { Delete, BulkDelete } from './controllers/delete';
import { List } from './controllers/list';

// Middlewares
const app = new Hono<{ Bindings: Env }>();
app.onError((error, c) => {
  if (error.message === 'Unauthorized') {
    c.status(401);
    return c.json({ success: false, error: error.message });
  }

  c.status(500);
  return c.json({ success: false, error: error.message });
});

app.use('*', prettyJSON());

app.use('*', async (c: Context, next: Next) => {
  const corsMiddleware = cors({
    origin: c.env.CORS_ORIGINS ?? [],
  });
  return corsMiddleware(c, next);
});

app.use('*', async (c: Context, next: Next) => {
  // No API key is set
  if (!c.env.API_KEY) {
    return next();
  }

  // API key is set
  // Should check the client's auth
  if (
    c.req.header('Authorization') === `Bearer ${c.env.API_KEY}` ||
    c.req.header('x-api-key') === c.env.API_KEY
  ) {
    return next();
  }

  throw new Error('Unauthorized');
});

// Upsert
app.put('/kv/values/:key', Upsert);
app.post('/kv/bulk', BulkUpsert);

// Get
app.get('/kv/values/:key', Get);
app.get('/kv/values', BulkGet);

// Delete
app.delete('/kv/values/:key', Delete);
app.delete('/kv/values', BulkDelete);

// List
app.get('/kv/keys', List);

export default app;
