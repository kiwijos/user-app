import type { City } from './City';

export interface CityFeature {
	type: 'Feature';
	geometry: {
		type: 'Polygon';
		coordinates: number[][][];
	};
	properties: City;
}
