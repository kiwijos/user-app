import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	throw redirect(302, '/');
};

export const actions: Actions = {
	default({ cookies, locals }) {
		cookies.delete('session', { path: '/' });
		locals.user = null;

		throw redirect(302, '/');
	}
};
