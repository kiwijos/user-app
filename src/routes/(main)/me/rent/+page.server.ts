import type { PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import type { Action, Actions } from './$types';
import { PUBLIC_REST_API_URL } from '$env/static/public';

export const load: PageServerLoad = async () => {
	throw redirect(302, '/me');
};

const rentBike: Action = async ({ request, fetch }) => {
	const data = await request.formData();

	const bikeId = data.get('bikeId');

	if (!bikeId) {
		return fail(400, { bikeId, missing: true, message: 'Ange ett cykel-ID' });
	}

	// Check amount should be a value larger than 0
	if (typeof bikeId !== 'string') {
		return fail(400, { bikeId, incorrect: true, message: 'Ange ett riktigt cykel-ID' });
	}

	let response;

	try {
		response = await fetch(`${PUBLIC_REST_API_URL}/user/bikes/rent/${bikeId}`, {
			method: 'POST'
		});
	} catch (e) {
		let message;
		if (e instanceof Error) message = e.message;
		else message = String(e);

		console.error(message);

		return fail(400, {
			bikeId,
			error: true,
			message: 'Kunde inte hyra cykeln på grund av ett serverfel'
		});
	}

	let result;

	try {
		result = await response.json();
	} catch (e) {
		let message;
		if (e instanceof Error) message = e.message;
		else message = String(e);

		console.error(message);

		return fail(400, {
			bikeId,
			error: true,
			message: 'Kunde inte hyra cykeln på grund av ett serverfel'
		});
	}

	if (!response?.ok) {
		let message;
		if (result.errors?.detail) message = result.errors.detail;
		else if (result.errors?.message) message = result.errors.message;
		else message = String(result.errors);

		console.error(message);

		return fail(400, {
			bikeId,
			error: true,
			message: 'Kunde inte hyra cykeln'
		});
	}

	return { bikeId, success: true, trip: result };
};

const endTrip: Action = async ({ request, fetch }) => {
	const data = await request.formData();

	const tripId = data.get('tripId');

	if (!tripId) {
		return fail(400, { tripId, missing: true, message: 'Ange ett trip-ID' });
	}

	// Check amount should be a value larger than 0
	if (typeof tripId !== 'string') {
		return fail(400, { tripId, incorrect: true, message: 'Ange ett riktigt trip-ID' });
	}

	let response;

	try {
		response = await fetch(`${PUBLIC_REST_API_URL}/user/bikes/return/${tripId}`, {
			method: 'PUT'
		});
	} catch (e) {
		let message;
		if (e instanceof Error) message = e.message;
		else message = String(e);

		console.error(message);

		return fail(400, {
			tripId,
			error: true,
			message: 'Kunde inte avsluta resan på grund av ett serverfel'
		});
	}

	let result;

	try {
		result = await response.json();
	} catch (e) {
		let message;
		if (e instanceof Error) message = e.message;
		else message = String(e);

		console.error(message);

		return fail(400, {
			tripId,
			error: true,
			message: 'Kunde inte avsluta resan på grund av ett serverfel'
		});
	}

	if (!response?.ok) {
		let message;
		if (result.errors?.detail) message = result.errors.detail;
		else if (result.errors?.message) message = result.errors.message;
		else message = String(result.errors);

		console.error(message);

		return fail(400, {
			tripId,
			error: true,
			message: 'Kunde inte avsluta resan'
		});
	}

	return { tripId, success: true, trip: result };
};

export const actions: Actions = { rentBike, endTrip };
