import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { PUBLIC_REST_API_URL } from '$env/static/public';

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${PUBLIC_REST_API_URL}/user/transactions`, {
		method: 'POST'
	});

	const result = await response.json();

	if (!response.ok) {
		let message;
		if (result.errors?.detail) message = result.errors.detail;
		else if (result.errors?.message) message = result.errors.message;
		else message = String(result.errors);

		console.error(message);

		throw error(404, 'Kunde inte hitta betalningarna.');
	}

	return { transactions: result };
};
