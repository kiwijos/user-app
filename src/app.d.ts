import type { Trip } from '$lib/types/Trip';
import type { Transaction } from '$lib/types/Transaction';
import type { Card } from '$lib/types/Card';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				id: number;
				email: string;
			};
		}
		interface PageData {
			card?: Card;
			trips?: Trip[];
			transactions?: Transaction[];
		}
		// interface Platform {}
	}
}

declare module '@fortawesome/free-solid-svg-icons/index.es' {
	export * from '@fortawesome/free-solid-svg-icons';
}

declare module '@fortawesome/free-regular-svg-icons/index.es' {
	export * from '@fortawesome/free-regular-svg-icons';
}

declare module '@fortawesome/free-brands-svg-icons/index.es' {
	export * from '@fortawesome/free-brands-svg-icons';
}

export {};
