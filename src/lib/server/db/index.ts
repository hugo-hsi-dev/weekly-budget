import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '$lib/server/db/schema';

export const db = drizzle(DATABASE_URL, { schema, casing: 'snake_case' });
