export interface Bike {
	id: number;
	city_id: string;
	status_id: number;
	status_descr: string;
	charge_perc: number;
	active: boolean;
	coords: [number, number];
}
