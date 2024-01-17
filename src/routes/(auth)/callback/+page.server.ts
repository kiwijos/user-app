import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_GITHUB_ID } from '$env/static/public';
import { GITHUB_SECRET } from '$env/static/private';
import { PUBLIC_REST_API_URL } from '$env/static/public';

// Note that we render generic error messages on any error here, as we don't want to leak any sensitive information to the user

// This page is used as a callback url for GitHub OAuth
export const load: PageServerLoad = async ({ url, fetch, cookies }) => {
	const code = url.searchParams.get('code'); // Get the temporary code from the query string

	// Show an error if the verification code is missing
	// There are a couple of reasons why this might happen:
	// - The user denied access (which makes GitHub redirect back to this page without a code)
	// - The user entered the url `/callback` manually--on purpose or accidentally--without the code parameter
	if (typeof code !== 'string' || !code) {
		// If the user denied access, GitHub will redirect with error parameters
		const errorType = url.searchParams.get('error');
		const errorDescription = url.searchParams.get('error_description');

		if (typeof errorType === 'string' && typeof errorDescription === 'string') {
			console.error(`Error authenticating with GitHub: ${errorType} (${errorDescription})`);

			throw error(
				403,
				'Inloggning misslyckades. För att logga in måste du godkänna den här webbplatsen.'
			);
		}

		throw redirect(304, '/login'); // Assume the user entered the url manually and wants to login
	}

	// Exchange the code for an access token by posting the code back to GitHub
	let githubResponse;

	try {
		githubResponse = await fetch('https://github.com/login/oauth/access_token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify({
				client_id: PUBLIC_GITHUB_ID,
				client_secret: GITHUB_SECRET,
				code: code
			})
		});
	} catch (e) {
		let message;
		if (e instanceof Error) message = e.message;
		else message = String(e);

		console.error(
			'Request failed unexpectedly when trying to exchange GitHub code for access token',
			message
		);

		throw error(
			500,
			'Inloggning misslyckades. Möjligen på grund av ett serverfel. Försök igen senare.'
		);
	}

	if (!githubResponse?.ok) {
		console.error(
			'Request failed when trying to exchange GitHub code for access token',
			githubResponse
		);
		throw error(
			500,
			'Inloggning misslyckades. Möjligen på grund av ett serverfel. Försök igen senare.'
		);
	}

	let githubResult;

	try {
		githubResult = await githubResponse.json();
	} catch (e) {
		let message;
		if (e instanceof Error) message = e.message;
		else message = String(e);

		console.error(
			'Request succeeded when trying to exchange GitHub code for access token, but the response was not valid JSON',
			message
		);

		throw error(
			500,
			'Inloggning misslyckades. Möjligen på grund av ett serverfel. Försök igen senare.'
		);
	}

	let scopes: string;

	// Check that the app has access to the user's email address
	try {
		scopes = githubResult.scope.split(',');
	} catch (e) {
		let message;
		if (e instanceof Error) message = e.message;
		else message = String(e);

		console.error(
			'Request succeeded, but the response did not contain a scope. The temporary code might have expired or been used before.',
			message
		);

		throw error(
			500,
			'Inloggning misslyckades. Möjligen på grund av ett serverfel. Försök igen senare.'
		);
	}

	if (!scopes.includes('user:email')) {
		console.warn('The user denied access to the "user:email" scope', githubResult);
		throw error(
			403,
			'Inloggning misslyckades. För att logga in måste du ge tillgång till din e-postadress.'
		);
	}

	const accessToken = githubResult?.access_token;

	if (typeof accessToken !== 'string' || !accessToken) {
		console.error(
			'Request succeeded when trying to exchange GitHub code for access token, but no access token was returned',
			githubResult
		);
		throw error(
			500,
			'Inloggning misslyckades. Möjligen på grund av ett serverfel. Försök igen senare.'
		);
	}

	// Login the user by posting the access token to the REST API
	// Exchange it for a JWT with the user's data in it
	let restServerResponse;

	try {
		restServerResponse = await fetch(`${PUBLIC_REST_API_URL}/login/user`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				token: accessToken
			})
		});
	} catch (e) {
		let message;
		if (e instanceof Error) message = e.message;
		else message = String(e);

		console.error(message);

		throw error(
			500,
			'Inloggning misslyckades. Möjligen på grund av ett serverfel. Försök igen senare.'
		);
	}

	const restServerResult = await restServerResponse.json();

	if (!restServerResponse.ok) {
		console.error(
			'Request failed when trying to exchange access token for jwt token',
			restServerResult.errors.message
		);
		throw error(
			500,
			'Inloggning misslyckades. Möjligen på grund av ett serverfel. Försök igen senare.'
		);
	}

	const jwtToken = restServerResult?.data?.token;

	if (typeof jwtToken !== 'string' || !jwtToken) {
		console.error(
			'Request succeeded when trying to exchange access token for jwt token, but no jwt token was returned',
			restServerResult
		);
		throw error(
			500,
			'Inloggning misslyckades. Möjligen på grund av ett serverfel. Försök igen senare.'
		);
	}

	// The JWT it will be used to authenticate the user on subsequent requests in the same session
	cookies.set('session', jwtToken, {
		path: '/',
		sameSite: 'strict',
		maxAge: 60 * 60 * 24 // set cookie to expire after 24 hours
	});

	// We only use this endpoint to autheticate the user, so we don't need to display anything,
	// redirect instead (assuming all went well at this point)
	throw redirect(302, '/me');
};
