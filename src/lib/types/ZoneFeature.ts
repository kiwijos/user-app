import type { Zone } from './Zone';

export interface ZoneFeature {
	type: 'Feature';
	geometry: {
		type: 'Polygon';
		coordinates: number[][][];
	};
	properties: Zone;
}
