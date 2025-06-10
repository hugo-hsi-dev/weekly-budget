import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { db } from '../db';
import * as tables from '../db/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export type Session = Awaited<ReturnType<typeof validateSessionToken>>['session'];
export type User = Awaited<ReturnType<typeof validateSessionToken>>['user'];

export async function validateSessionToken(token: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const row = await db.query.session.findFirst({
		where: (table, { eq }) => eq(table.id, sessionId)
	});

	if (!row) {
		return { session: null, user: null };
	}

	const { expiresAt, id, userName } = row;

	const session = { expiresAt, id };

	const user = { userName };

	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(tables.session).where(eq(tables.session.id, session.id));
		return { session: null, user: null };
	}

	if (Date.now() >= session.expiresAt.getTime() + 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 60 * 60 * 24 * 30);
		await db
			.update(tables.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(tables.session.id, session.id));
	}
	return { session, user };
}

export function invalidateSession(sessionId: string) {
	db.delete(tables.session).where(eq(tables.session.id, sessionId));
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set('session', token, {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		expires: expiresAt
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set('session', '', {
		httpOnly: true,
		path: '/',
		secure: import.meta.env.PROD,
		sameSite: 'lax',
		maxAge: 0
	});
}

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
	return token;
}

export async function createSession(token: string, userName: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

	const session = {
		id: sessionId,
		userName,
		expiresAt: new Date(Date.now() + 60 * 60 * 24 * 30)
	};

	await db.insert(tables.session).values(session);

	return session;
}
