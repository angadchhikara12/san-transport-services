import { json } from '@sveltejs/kit';
import { ConvexHttpClient } from 'convex/browser';
import { PUBLIC_CONVEX_URL } from '$env/static/public';
import { api } from '../../../convex/_generated/api.js';

const client = new ConvexHttpClient(PUBLIC_CONVEX_URL);

interface BookingRequest {
	service_type: string;
	pickup_date?: string;
	pickup_time?: string;
	pickup_location: string;
	dropoff_location?: string;
	passengers: string;
	luggage?: string;
	special_requests?: string;
	vehicle?: string;
	first_name: string;
	last_name?: string;
	email: string;
	phone?: string;
	company?: string;
	price_quote?: number;
	helcim_transaction_id?: string;
}

export async function POST({ request }) {
	try {
		const body: BookingRequest = await request.json();
		const result = await client.mutation(api.bookings.create, {
			service_type: body.service_type,
			pickup_date: body.pickup_date ?? '',
			pickup_time: body.pickup_time ?? '',
			pickup_location: body.pickup_location,
			dropoff_location: body.dropoff_location ?? '',
			passengers: body.passengers,
			luggage: body.luggage ?? '',
			special_requests: body.special_requests ?? '',
			vehicle: body.vehicle ?? '',
			first_name: body.first_name,
			last_name: body.last_name ?? '',
			email: body.email,
			phone: body.phone ?? '',
			company: body.company ?? '',
			price_quote: body.price_quote,
			helcim_transaction_id: body.helcim_transaction_id
		});
		return json({ booking: { booking_code: result.booking_code } }, { status: 201 });
	} catch (err) {
		console.error('Booking API error:', err);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
}