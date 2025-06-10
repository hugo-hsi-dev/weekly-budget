import { db } from '$lib/server/db';
import { error, fail, redirect } from '@sveltejs/kit';
import * as tables from '$lib/server/db/schema.js';
import { users } from '$lib/types.js';
import { invalidate } from '$app/navigation';

export async function load({ locals, depends }) {
	depends('user');
	if (!locals.user) {
		return redirect(302, '/authenticate');
	}

	const purchases = await db.query.purchase.findMany();

	return { purchases, user: locals.user };
}

export const actions = {
	changeUser: async ({ locals, request }) => {
		if (!locals.user) {
			return redirect(302, '/authenticate');
		}

		const formData = await request.formData();
		const user = formData.get('user');
		console.log(user);
		if (!user || !users.includes(user as any)) {
			return fail(400, { message: 'Invalid user' });
		}

		const validatedUser = user as (typeof users)[number];

		await db.update(tables.session).set({ userName: validatedUser });

		locals.user.userName = validatedUser;

		return { success: true };
	}
	// add: async ({ locals }) => {
	// 	console.log('locals', locals);
	// 	return { success: true };
	// }
};
