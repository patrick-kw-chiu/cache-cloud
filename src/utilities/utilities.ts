import { UpsertBodyWithoutKey } from '../schema/schema';

const arrayConstructor = [].constructor;
const objectConstructor = {}.constructor;

export const isJson = (value: any) => {
	if (value.constructor === arrayConstructor) {
		return true;
	}
	if (value.constructor === objectConstructor) {
		return true;
	}
	return false;
};

/**
 * If body.value is a JSON, stringify it
 */
export const formulateValueAndMetadata = (body: UpsertBodyWithoutKey) => {
	const value = isJson(body.value) ? JSON.stringify(body.value) : body.value;
	const metadata = body.expiration
		? { expiration: body.expiration }
		: body.expirationTtl
		? { expirationTtl: body.expirationTtl }
		: {};

	return { value, metadata };
};
