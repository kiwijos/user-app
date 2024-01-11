export interface City {
	id: string;
	name: string;
	speed_limit: number;
	geometry: {
		type: string;
		coordinates: number[][][];
	};
}
