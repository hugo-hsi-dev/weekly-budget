import { db } from '$lib/server/db';
import { error, fail, redirect } from '@sveltejs/kit';
import * as tables from '$lib/server/db/schema.js';
import { users } from '$lib/types.js';
import { invalidate } from '$app/navigation';
import { asc, eq } from 'drizzle-orm';
import { getWeekBounds } from '$lib/utils.js';

export async function load({ locals, url }) {
	if (!locals.user) {
		return redirect(302, '/authenticate');
	}

	const searchWeek = url.searchParams.get('week');
	const search = getWeekBounds(searchWeek ? new Date(searchWeek) : new Date());

	const current = getWeekBounds();

	const earliestPurchase = await db.query.purchase.findFirst({
		orderBy: (table, { asc }) => [asc(table.createdAt)]
	});

	const earliest = getWeekBounds(earliestPurchase?.createdAt);

	const activeWeeks: Date[] = [];

	for (let i = new Date(earliest.monday); i <= current.monday; i.setDate(i.getDate() + 7)) {
		activeWeeks.push(new Date(i));
	}
	activeWeeks.reverse();

	const purchases = await db.query.purchase.findMany({
		orderBy: (table, { desc }) => [desc(table.createdAt)],
		where: (table, { gte, lt, and }) =>
			and(gte(table.createdAt, search.monday), lt(table.createdAt, search.sunday))
	});

	const totalBudget = await db.query.budget.findFirst();

	const numTotalBudget = totalBudget ? Number(totalBudget.amount) : 120.0;

	const remainingBudget = purchases
		.reduce((acc, currentValue) => {
			return acc - Number(currentValue.amount);
		}, numTotalBudget)
		.toFixed(2)
		.toString();

	return {
		activeWeeks,
		purchases,
		user: locals.user,
		totalBudget: totalBudget?.amount ?? '120.00',
		remainingBudget
	};
}

export const actions = {
	changeUser: async ({ locals, request }) => {
		if (!locals.user) {
			return redirect(302, '/authenticate');
		}

		const formData = await request.formData();
		const user = formData.get('user');
		if (!user || !users.includes(user as any)) {
			return fail(400, { message: 'Invalid user' });
		}

		const validatedUser = user as (typeof users)[number];

		await db.update(tables.session).set({ userName: validatedUser });

		locals.user.userName = validatedUser;

		return { success: true };
	},
	addPurchase: async ({ locals, request }) => {
		if (!locals.user) {
			return redirect(302, '/authenticate');
		}

		const formData = await request.formData();
		const name = (formData.get('name') as string) || null;
		const amount = (formData.get('amount') as string).slice(1) || null;

		if (!name || name.length < 3) {
			return fail(400, { message: 'Name has to be at least 3 characters' });
		}

		if (!amount || isNaN(Number(amount.replaceAll(',', '')))) {
			return fail(400, { message: 'Amount is not a number' });
		}

		await db
			.insert(tables.purchase)
			.values({ amount: amount.replaceAll(',', ''), name, user: locals.user.userName });

		return { success: true };
	},
	editPurchase: async ({ locals, request }) => {
		if (!locals.user) {
			return redirect(302, '/authenticate');
		}

		const formData = await request.formData();
		const id = (formData.get('id') as string) || null;
		const name = (formData.get('name') as string) || undefined;
		const amount = (formData.get('amount') as string).slice(1) || null;
		const user = (formData.get('user') as string) || null;

		if (!id) {
			return fail(400, { message: 'Something went wrong, please contact admin' });
		}

		if (!amount || isNaN(Number(amount.replaceAll(',', '')))) {
			return fail(400, { message: 'Amount is not a number' });
		}

		if (!user || !users.includes(user as any)) {
			return fail(400, { message: 'Invalid user' });
		}

		await db
			.update(tables.purchase)
			.set({ name, amount: amount.replaceAll(',', ''), updatedAt: new Date(), user })
			.where(eq(tables.purchase.id, Number(id)));

		return { success: true };
	},
	deletePurchase: async ({ locals, request }) => {
		if (!locals.user) {
			return redirect(302, '/authenticate');
		}

		const formData = await request.formData();
		const id = (formData.get('id') as string) || null;

		if (!id) {
			return fail(400, { message: 'Something went wrong, please contact admin' });
		}

		await db.delete(tables.purchase).where(eq(tables.purchase.id, Number(id)));

		return { success: true };
	},
	updateBudget: async ({ locals, request }) => {
		if (!locals.user) {
			return redirect(302, '/authenticate');
		}

		const formData = await request.formData();
		const newBudget = (formData.get('budget') as string).slice(1) || null;

		if (!newBudget || isNaN(Number(newBudget.replaceAll(',', '')))) {
			return fail(400, { message: 'The new budget is not a number' });
		}

		await db.delete(tables.budget);

		await db.insert(tables.budget).values({ amount: newBudget.replaceAll(',', '') });

		return { success: true };
	}
};
