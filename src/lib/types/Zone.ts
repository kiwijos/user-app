export interface Zone {
	id: number;
	zone_id: number;
	descr: string;
	city_id: string;
	geometry: {
		type: string;
		coordinates: number[][][];
	};
}
