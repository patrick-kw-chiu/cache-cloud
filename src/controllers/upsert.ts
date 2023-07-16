import { Context } from 'hono';

import {
  KeyParam,
  KeyParamSchema,
  UpsertBodyWithoutKey,
  UpsertBodyWithoutKeySchema,
  UpsertBody,
  UpsertBodySchema,
} from '../schema/schema';

import { formulateValueAndMetadata } from '../utilities/utilities';

export const Upsert = async (c: Context) => {
  // 1. Type check
  const param: KeyParam = c.req.param() as KeyParam;
  const body: UpsertBodyWithoutKey = await c.req.json();

  const paramCheck = KeyParamSchema.safeParse(param);
  if (!paramCheck.success) {
    c.status(400);
    return c.json({ success: false, error: 'invalid key' });
  }

  const bodyCheck = UpsertBodyWithoutKeySchema.safeParse(body);
  if (!bodyCheck.success) {
    c.status(400);
    return c.json({ success: false, error: bodyCheck.error });
  }

  // 2. Upsert
  const { value, metadata } = formulateValueAndMetadata(body);
  await c.env.KV.put(param.key, value, metadata);

  return c.json({ success: true });
};

export const BulkUpsert = async (c: Context) => {
  // 1. Type check
  const body: UpsertBody = await c.req.json();

  const bodyCheck = UpsertBodySchema.safeParse(body);
  if (!bodyCheck.success) {
    c.status(400);
    return c.json({ success: false, error: bodyCheck.error });
  }

  // 2. Bulk Upsert
  const promises = body.map(({ key, ...upsertBody }) => {
    const { value, metadata } = formulateValueAndMetadata(upsertBody);
    return c.env.KV.put(key, value, metadata);
  });
  await Promise.all(promises);

  return c.json({ success: true });
};
