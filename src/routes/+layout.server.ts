import type { LayoutServerLoad } from './$types';
import { PUBLIC_REST_API_URL } from '$env/static/public';
import type { City } from '$lib/types/City';
import type { Zone } from '$lib/types/Zone';

// pass `locals.user` to the `page` store for use inside client-side code
export const load: LayoutServerLoad = async ({ fetch, locals }) => {
	const cities = await fetch(`${PUBLIC_REST_API_URL}/cities`).then((r) => r.json());

	const cityFeatures = cities.map((city: City) => {
		return {
			type: 'Feature',
			geometry: city.geometry,
			properties: {
				...city
			}
		};
	});

	const zones = await fetch(`${PUBLIC_REST_API_URL}/zones`).then((r) => r.json());

	const zonesFeatures = zones.map((zone: Zone) => {
		return {
			type: 'Feature',
			geometry: zone.geometry,
			properties: {
				...zone
			}
		};
	});

	return {
		user: locals?.user ?? null,
		zones: zonesFeatures,
		cities: cityFeatures
	};
};
