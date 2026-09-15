import { json } from '@sveltejs/kit';
import { ConvexHttpClient } from 'convex/browser';
import { PUBLIC_CONVEX_URL } from '$env/static/public';
import { api } from '../../../convex/_generated/api.js';

const client = new ConvexHttpClient(PUBLIC_CONVEX_URL);

interface ContactRequest {
	first_name: string;
	last_name?: string;
	email: string;
	phone_number?: string;
	subject?: string;
	message: string;
}

export async function POST({ request }) {
	try {
		const body: ContactRequest = await request.json();
		await client.mutation(api.contact.create, {
			first_name: body.first_name,
			last_name: body.last_name ?? '',
			email: body.email,
			phone_number: body.phone_number ?? '',
			subject: body.subject ?? '',
			message: body.message
		});
		return json({ contact: { status: 'new' } }, { status: 201 });
	} catch (err) {
		console.error('Contact API error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}