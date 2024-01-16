export interface TripCompleted {
	id: number;
	user_id: number;
	bike_id: number;
	start_time: string;
	end_time: string;
	start_cost: number;
	park_cost: number;
	var_cost: number;
	total_cost: number;
	start_pos: number[];
	end_pos: number[];
}
