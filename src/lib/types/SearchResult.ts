interface OnClickCallback {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(value: any): void;
}

export interface SearchResult {
	name: string;
	alias: string[];
	callback: OnClickCallback;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	value: any;
}
