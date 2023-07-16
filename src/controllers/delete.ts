import { Context } from 'hono';

import { KeyParam, DeleteBody, DeleteBodySchema } from '../schema/schema';

export const Delete = async (c: Context) => {
  const param: KeyParam = c.req.param() as KeyParam;

  await c.env.KV.delete(param.key);
  return c.json({ success: true });
};

export const BulkDelete = async (c: Context) => {
  // 1. Input check
  const body: DeleteBody = (await c.req.json()) as DeleteBody;

  const bodyCheck = DeleteBodySchema.safeParse(body);
  if (!bodyCheck.success) {
    c.status(400);
    return c.json({ success: false, error: bodyCheck.error });
  }

  // 2. Bulk Delete
  const promises = body.map((key) => c.env.KV.delete(key));
  await Promise.all(promises);
  return c.json({ success: true });
};
