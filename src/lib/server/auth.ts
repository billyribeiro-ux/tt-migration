import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export const sessionCookie = 'tt_admin_session';
export const sessionMaxAge = 60 * 60 * 12;

type SessionPayload = {
	username: string;
	role: 'admin' | 'member' | 'support';
	showcase: boolean;
	expiresAt: number;
};

export function hashPassword(password: string) {
	const salt = randomBytes(16);
	const derivedKey = scryptSync(password, salt, 64);
	return `scrypt$${salt.toString('base64url')}$${derivedKey.toString('base64url')}`;
}

export function verifyPassword(password: string, storedHash: string) {
	const [algorithm, saltValue, hashValue] = storedHash.split('$');
	if (algorithm !== 'scrypt' || !saltValue || !hashValue) return false;

	try {
		const salt = Buffer.from(saltValue, 'base64url');
		const expected = Buffer.from(hashValue, 'base64url');
		const actual = scryptSync(password, salt, expected.length);
		return expected.length === actual.length && timingSafeEqual(expected, actual);
	} catch {
		return false;
	}
}

function signature(value: string, secret: string) {
	return createHmac('sha256', secret).update(value).digest('base64url');
}

export function createSessionToken(user: Omit<SessionPayload, 'expiresAt'>, secret: string) {
	const payload: SessionPayload = {
		...user,
		expiresAt: Date.now() + sessionMaxAge * 1000
	};
	const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
	return `${encoded}.${signature(encoded, secret)}`;
}

export function readSessionToken(token: string | undefined, secret: string | undefined): App.Locals['user'] {
	if (!token || !secret) return null;
	const [encoded, suppliedSignature] = token.split('.');
	if (!encoded || !suppliedSignature) return null;

	const expectedSignature = signature(encoded, secret);
	const supplied = Buffer.from(suppliedSignature);
	const expected = Buffer.from(expectedSignature);
	if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;

	try {
		const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
		if (
			typeof payload.username !== 'string' ||
			!['admin', 'member', 'support'].includes(payload.role) ||
			typeof payload.expiresAt !== 'number' ||
			payload.expiresAt <= Date.now()
		) {
			return null;
		}

		return { username: payload.username, role: payload.role, showcase: Boolean(payload.showcase) };
	} catch {
		return null;
	}
}
