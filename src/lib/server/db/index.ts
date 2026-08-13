import { env } from '$env/dynamic/private';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const connection = env.DATABASE_URL ? neon(env.DATABASE_URL) : null;

export const db = connection ? drizzle(connection, { schema }) : null;
export const databaseConfigured = db !== null;
