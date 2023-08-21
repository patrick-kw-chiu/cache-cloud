import { Context } from 'hono';

export const List = async (c: Context) => {
  const prefix = c.req.query('prefix');
  const limit = c.req.query('limit') || '';
  const cursor = c.req.query('cursor');
  const value = await c.env.KV.list({
    prefix,
    limit: parseInt(limit) || 1000,
    cursor,
  });

  value.listComplete = value.list_complete;
  delete value.list_complete;

  return c.json({
    success: true,
    ...value,
  });
};
