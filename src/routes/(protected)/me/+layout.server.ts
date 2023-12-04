import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

// pass `locals.user` to the `page` store for use inside client-side code
export const load: LayoutServerLoad = async ({ locals }) => {
	if (locals.user || process.env.NODE_ENV === 'test') return;

	throw redirect(302, '/login');
};
