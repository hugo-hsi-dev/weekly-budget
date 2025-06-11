import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function getWeekBounds(date = new Date()) {
	// Clone the date to avoid mutating the original
	const current = new Date(date);

	// Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
	const day = current.getDay();

	// Calculate how many days to subtract to get Monday (if Sunday, go back 6 days)
	const diffToMonday = day === 0 ? -6 : 1 - day;

	// Monday
	const monday = new Date(current);
	monday.setDate(current.getDate() + diffToMonday);
	monday.setHours(0, 0, 0, 0);

	// Sunday (Monday + 6 days)
	const sunday = new Date(monday);
	sunday.setDate(monday.getDate() + 6);
	sunday.setHours(23, 59, 59, 999);

	return { monday, sunday };
}
