import type { PageServerLoad } from './$types';
import { PUBLIC_REST_API_URL } from '$env/static/public';
import type { Bike } from '$lib/types/Bike';

export const load: PageServerLoad = async ({ fetch }) => {
	const bikes = (await fetch(`${PUBLIC_REST_API_URL}/bikes`)
		.then((r) => r.json())
		.catch(() => [])) as Bike[];

	const availableBikes = bikes.filter((bike: Bike) => bike.status_id !== 2 && bike.status_id !== 5);

	const bikeFeatures = availableBikes.map((bike: Bike) => {
		return {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: bike.coords
			},
			properties: {
				...bike
			}
		};
	});

	return {
		bikes: bikeFeatures
	};
};
