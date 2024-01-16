import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { CurrentTrip } from '$lib/types/CurrentTrip';

const defaultValue: CurrentTrip[] = [];
const initialValue: CurrentTrip[] = browser
	? JSON.parse(window.localStorage.getItem('currentTrips') || 'null') ?? defaultValue
	: defaultValue;

const currentTrips = writable<CurrentTrip[]>(initialValue);

currentTrips.subscribe((value) => {
	if (browser) {
		window.localStorage.setItem('currentTrips', JSON.stringify(value));
	}
});

// Helper function to append a new item to the store
export function appendItem(newTrip: CurrentTrip) {
	currentTrips.update((trips) => [...trips, newTrip]);
}

// Helper function to remove a specific item from the store
export function removeItem(tripId: number) {
	currentTrips.update((trips) => trips.filter((trip) => trip.id !== tripId));
}

export default currentTrips;
