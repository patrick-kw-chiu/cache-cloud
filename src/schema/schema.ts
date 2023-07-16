import { z } from 'zod';

export const KeyParamSchema = z.object({
	key: z.string().nonempty(),
});

export const UpsertBodyWithoutKeySchema = z.object({
	value: z.union([
		z.string(),
		z.number(),
		z.array(z.any()),
		z.record(z.string(), z.any()),
	]),
	expiration: z.number().int().optional(),
	expirationTtl: z.number().int().optional(),
});

export const UpsertBodySchema = z.array(
	UpsertBodyWithoutKeySchema.extend({
		key: z.string().nonempty(),
	})
);

export const DeleteBodySchema = z.array(z.string()).nonempty();

export type Env = {
	KV: KVNamespace;
};

export type KeyParam = z.infer<typeof KeyParamSchema>;
export type UpsertBodyWithoutKey = z.infer<typeof UpsertBodyWithoutKeySchema>;
export type UpsertBody = z.infer<typeof UpsertBodySchema>;
export type DeleteBody = z.infer<typeof DeleteBodySchema>;
