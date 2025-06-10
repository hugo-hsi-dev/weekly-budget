import { hash, verify } from '@node-rs/argon2';

export async function hashPin(pin: string) {
	return await hash(pin, {
		memoryCost: 19456,
		timeCost: 2,
		outputLen: 32,
		parallelism: 1
	});
}

export async function verifyPinHash(hash: string, pin: string): Promise<boolean> {
	return await verify(hash, pin);
}
