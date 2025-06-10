// export async function load({ cookies }) {}

import { hash, verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { HASHED_PIN } from '$env/static/private';
import { verifyPinHash } from '$lib/server/auth/pin.js';
import {
	createSession,
	generateSessionToken,
	setSessionTokenCookie
} from '$lib/server/auth/session.js';

const DEFAULT_NAME = 'Cassie';

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const pin = formData.get('pin');
		if (!pin) {
			fail(400, { message: 'Invalid pin' });
		}

		console.log(HASHED_PIN);

		const validPin = await verifyPinHash(HASHED_PIN, pin as string);

		if (!validPin) {
			return fail(400, {
				message: 'Invalid pin'
			});
		}

		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, DEFAULT_NAME);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/');
	}
};
