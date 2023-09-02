import { Context } from 'hono';

import { KeyParam } from '../schema/schema';

export const Get = async (c: Context) => {
  const param: KeyParam = c.req.param() as KeyParam;

  const value = await c.env.KV.get(param.key);
  try {
    return c.json({ success: true, result: JSON.parse(value) });
  } catch (e) {
    return c.json({ success: true, result: value });
  }
};

export const BulkGet = async (c: Context) => {
  // 1. Input check
  const keys = c.req.queries('key') || [];
  if (keys.length === 0) {
    return c.json({ success: false, error: 'key: Required' });
  }

  // 2. Bulk Get
  const promises = keys.map((key) => {
    return c.env.KV.get(key);
  });
  const values = await Promise.all(promises);

  return c.json({
    success: true,
    results: keys.map((key, index) => {
      try {
        return { key, value: JSON.parse(values[index]) };
      } catch (e) {
        return { key, value: values[index] };
      }
    }),
  });
};
