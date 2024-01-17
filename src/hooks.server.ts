import type { Handle } from '@sveltejs/kit';
import { redirect, error } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
import type { CustomJwtPayload } from './lib/types/CustomJwtPayload';
import type { HandleFetch } from '@sveltejs/kit';
import { PUBLIC_REST_API_URL } from '$env/static/public';
import { PRIVATE_REST_API_KEY } from '$env/static/private';

export const handleFetch: HandleFetch = async ({ request, fetch, event }) => {
	if (request.url.startsWith(PUBLIC_REST_API_URL)) {
		// Add headers to requests to the public REST API
		request.headers.set('x-access-token', event.cookies.get('session') as string);
		request.headers.set('x-api-key', PRIVATE_REST_API_KEY);
	}

	return fetch(request);
};

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('session');

	// Redirect early to login page if the user is not logged in
	if (typeof token !== 'string' || !token) {
		// Sometimes the user object is still in the request locals, for example if:
		// 	- the cookie expired
		// 	- the cookie was removed manually (e.g. via the browser dev tools)
		// The user object is only explicitly set to null when:
		// 	- the user logs out via /logout
		// 	- the token check fails (e.g. invalid or expired token)
		event.locals.user = null; // <-- make sure the user object is null in any case

		// No token, no access to the me page
		if (event.url.pathname.startsWith('/me')) {
			throw redirect(302, '/');
		}

		return await resolve(event); // <-- no token, no problem (resolve the request as normal)
	}

	let decoded: CustomJwtPayload;
	const expDate = new Date(0);

	try {
		decoded = jwtDecode(token); // <-- throws if the token is malformed for example
		const exp = decoded.exp as number;
		expDate.setUTCSeconds(exp);
	} catch (e) {
		let message;
		if (e instanceof Error) message = e.message;
		else message = String(e);

		console.error(message);

		// Invalid token, force the user to log in again
		event.locals.user = null;
		event.cookies.delete('session', { path: '/' });

		throw redirect(302, '/');
	}

	if (expDate < new Date()) {
		// Expired token, force the user to log in again
		event.locals.user = null;
		event.cookies.delete('session', { path: '/' });

		throw redirect(302, '/');
	}

	// Valid token, presumably with some valid user data in it
	// Put the user data in the request so that it can be used in the page load functions
	event.locals.user = {
		id: decoded.id,
		email: decoded.email
	};

	// Redirect to the me page if the user is already logged in
	if (event.url.pathname === '/') {
		throw redirect(302, '/me');
	}

	return await resolve(event);
};
