import type { LayoutServerLoad } from './$types';
import { PUBLIC_REST_API_URL } from '$env/static/public';

// pass `locals.user` to the `page` store for use inside client-side code
export const load: LayoutServerLoad = async ({ fetch, depends }) => {
	let card;
	let balance;

	try {
		const response = await fetch(`${PUBLIC_REST_API_URL}/user/card`, {
			method: 'POST'
		});

		const result = await response.json();

		if (!response.ok) {
			// When the response is not OK, the server will return an `errors` object
			// In the case of no result, the server will return a 404 status code (that's the plan anyway)
			let message;
			if (result.errors?.detail) message = result.errors.detail;
			else if (result.errors?.message) message = result.errors.message;
			else message = String(result.errors);

			console.error(
				`Server responded with an error when requesting card details: (${response.status}) ${message}`
			);
		}

		card = result;
	} catch (error) {
		// These are unexpected errors, thrown when the server is unreachable, the response cannot be parsed, etc.
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);

		console.error(`An unexpected error occurred when requesting card details: ${message}`);
	}

	try {
		const response = await fetch(`${PUBLIC_REST_API_URL}/user/balance`, {
			method: 'POST'
		});

		const result = await response.json();

		if (!response.ok) {
			// When the response is not OK, the server will return an `errors` object
			// In the case of no card, the server will return a 404 status code (that's the plan anyway)
			let message;
			if (result.errors?.detail) message = result.errors.detail;
			else if (result.errors?.message) message = result.errors.message;
			else message = String(result.errors);

			console.error(
				`Server responded with an error when requesting balance: (${response.status}) ${message}`
			);
		}
		balance = result?.balance;
	} catch (error) {
		// These are unexpected errors, thrown when the server is unreachable, the response cannot be parsed, etc.
		let message;
		if (error instanceof Error) message = error.message;
		else message = String(error);

		console.error(`An unexpected error occurred when requesting balance: ${message}`);
	}

	depends('server:fetch');

	return {
		card,
		balance
	};
};
