<script lang="ts">
	import currentTrips from '$lib/stores/currentTrips';
	import EndTripButton from '$lib/components/EndTripButton.svelte';
	import Fa from 'svelte-fa';
	import { faParking } from '@fortawesome/free-solid-svg-icons';
	import {
		calculateTimeDifference,
		formatMilliseconds,
		formatDateReadable
	} from '$lib/services/dateFormatter';
	import type { CurrentTripFormatted } from '$lib/types/CurrentTripFormatted';
	import type { TripCompleted } from '$lib/types/TripCompleted';

	let currentTripsFormatted: CurrentTripFormatted[] = [];

	$: if ($currentTrips[0]) {
		currentTripsFormatted = $currentTrips.map((trip) => {
			const timeDifferenceMs = calculateTimeDifference(trip.start_time, String(new Date()));

			const timeDifferenceMin = timeDifferenceMs / 1000 / 60;

			const estimatedCost = 3 * timeDifferenceMin;

			return {
				...trip,
				time_difference_formatted: formatMilliseconds(timeDifferenceMs),
				start_time_formatted: formatDateReadable(trip.start_time),
				estimated_cost: estimatedCost
			};
		});
	}

	const removeTrip = (e: CustomEvent<TripCompleted>) => {
		const index = currentTripsFormatted.findIndex((trip) => trip.id === e.detail.id);

		currentTripsFormatted.splice(index, 1);
	};
</script>

<div class="flex h-full flex-col">
	{#if currentTripsFormatted[0]}
		<div class="py-8 space-y-4 overflow-auto">
			{#each currentTripsFormatted as trip}
				<div class="border-b dark:border-surface-800 space-y-2 pb-2">
					<div class="border-b border-primary-400 dark:border-primary-900 pl-4">
						<h1 class="text-lg capitalize text-primary-400 dark:text-primary-900">
							{trip.start_time_formatted}
						</h1>
					</div>
					<div class="flex justify-between px-4">
						<div class="grow">
							<div class="text-lg text-surface-700 dark:text-surface-300 flex justify-between">
								<p aria-describedby="time-estimation-disclaimer">
									~{trip.time_difference_formatted}*
								</p>
								<p>Cykel {trip.bike_id}</p>
							</div>
							<div class="">
								<p aria-describedby="cost-estimation-disclaimer">
									Tidsavgift {trip.estimated_cost.toFixed(2)} kr**
								</p>
							</div>
							<div class="text-surface-500 flex justify-between">
								<p>Privat</p>
								<p>Resenr. {trip.id}</p>
							</div>
						</div>
					</div>
					<div class="px-2 grid grid-cols-2 gap-2 place-content-stretch">
						<button class="w-full btn variant-filled-primary text-surface-50 dark:text-primary-100"
							><span><Fa icon={faParking} scale={1.2} /></span><span>Hitta parkering</span></button
						>
						<EndTripButton on:tripEndedSuccessfully={removeTrip} tripId={trip.id} />
					</div>
				</div>
			{/each}
		</div>
		<div class="px-4 grow space-y-2 py-4 bg-surface-200 dark:bg-surface-800 self-end">
			<p id="time-estimation-disclaimer" class="text-surface-500 text-sm">
				* Tiden beräknades när sidan laddades in. Den uppdateras inte automatiskt.
			</p>
			<p id="cost-estimation-disclaimer" class="text-surface-500 text-sm">
				** Preliminär kostnad baserad på resetiden vid tidpunkten då sidan laddades in. Den
				uppdateras inte automatiskt. Parkering tillkommer.
			</p>
		</div>
	{:else}
		<div class="row-span-2 p-4 text-center flex-grow flex flex-col justify-center items-center">
			<p class="text-surface-700 dark:text-surface-300 text-lg">Du har inga aktiva resor.</p>
			<p class="text-surface-500">
				För att snabbt kunna visa dig dina aktiva resor här så sparas de i webbläsaren. Resorna
				sparas även hos oss och du kan alltid komma åt dem via resehistoriken.
			</p>
		</div>
	{/if}
</div>
