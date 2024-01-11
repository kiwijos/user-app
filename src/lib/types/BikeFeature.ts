import type { Bike } from './Bike';

export interface BikeFeature {
	type: 'Feature';
	geometry: {
		type: 'Point';
		coordinates: [number, number];
	};
	properties: {
		id: Bike['id'];
		city_id: Bike['city_id'];
		status_id: Bike['status_id'];
		status_descr: Bike['status_descr'];
		charge_perc: Bike['charge_perc'];
		active: Bike['active'];
		coords: Bike['coords'];
		cluster?: boolean;
		cluster_id?: number;
	};
}
