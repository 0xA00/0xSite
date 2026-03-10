import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import db from '$lib/server/db';

const MAX_NAME_LENGTH = 30;
const MAX_MESSAGE_LENGTH = 280;
const RATE_LIMIT_MS = 60_000; // 1 message per minute per IP

const recentPosters = new Map<string, number>();

function sanitize(input: string): string {
	return input
		.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // strip control chars
		.trim();
}

export const load: PageServerLoad = async () => {
	const messages = db
		.prepare('SELECT id, name, message, created_at FROM guestbook ORDER BY created_at DESC LIMIT 50')
		.all() as { id: number; name: string; message: string; created_at: string }[];

	return { messages };
};

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		const ip = getClientAddress();

		const lastPost = recentPosters.get(ip);
		if (lastPost && Date.now() - lastPost < RATE_LIMIT_MS) {
			const secondsLeft = Math.ceil((RATE_LIMIT_MS - (Date.now() - lastPost)) / 1000);
			return fail(429, {
				error: `Slow down! You can post again in ${secondsLeft}s.`
			});
		}

		const formData = await request.formData();
		const rawName = formData.get('name');
		const rawMessage = formData.get('message');

		if (!rawName || typeof rawName !== 'string' || !rawName.trim()) {
			return fail(400, { error: 'Name is required.' });
		}
		if (!rawMessage || typeof rawMessage !== 'string' || !rawMessage.trim()) {
			return fail(400, { error: 'Message is required.' });
		}

		const name = sanitize(rawName).slice(0, MAX_NAME_LENGTH);
		const message = sanitize(rawMessage).slice(0, MAX_MESSAGE_LENGTH);

		if (!name.length || !message.length) {
			return fail(400, { error: 'Name and message cannot be empty after sanitization.' });
		}

		db.prepare('INSERT INTO guestbook (name, message) VALUES (?, ?)').run(name, message);

		recentPosters.set(ip, Date.now());

		if (recentPosters.size > 1000) {
			const now = Date.now();
			for (const [key, time] of recentPosters) {
				if (now - time > RATE_LIMIT_MS) recentPosters.delete(key);
			}
		}

		return { success: true };
	}
};
