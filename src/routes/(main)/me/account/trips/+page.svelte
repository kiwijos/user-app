<script lang="ts">
	import type { PageData } from './$types';
	import Fa from 'svelte-fa';
	import { faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons';
	import {
		calculateTimeDifference,
		formatDateReadable,
		formatMilliseconds
	} from '$lib/services/dateFormatter';
	import type { Trip } from '$lib/types/Trip';
	import type { TripFormatted } from '$lib/types/TripFormatted';
	import TabSwitcher from '$lib/components/TabSwitcher.svelte';
	import TabButton from '$lib/components/TabButton.svelte';
	import VerticalTable from '$lib/components/VerticalTable.svelte';
	import EndTripButton from '$lib/components/EndTripButton.svelte';
	import type { TripCompleted } from '$lib/types/TripCompleted';

	let currentTab = 0;

	let selectedTrip: TripFormatted | undefined;

	let selectedRows: (string | number)[][] = [];
	let headers: string[] = [];

	$: if (selectedTrip) {
		selectedRows = [
			[
				selectedTrip.id,
				selectedTrip.bike_id,
				selectedTrip.time_difference_formatted,
				selectedTrip.start_time_formatted,
				selectedTrip.end_time_formatted,
				selectedTrip.total_cost_formatted,
				selectedTrip.start_cost_formatted,
				selectedTrip.var_cost_formatted,
				selectedTrip.park_cost_formatted
			]
		];
		headers = [
			'Resenr',
			'Cykel',
			'Total tid',
			'Starttid',
			'Sluttid',
			'Total kostnad',
			'(varav startavgift)',
			'(varav tidsavgift)',
			'(varav parkering)'
		];
	}

	function formatPrice(price: number) {
		return `${price.toFixed(2)} kr`.replace('.', ',');
	}

	function handleTabButtonClick(event: CustomEvent<{ index: number }>, tripId: number | undefined) {
		currentTab = event.detail.index;

		if (currentTab === 1 && tripId !== undefined) {
			selectedTrip = formattedTrips.find((trip) => trip.id === tripId);
		}

		if (currentTab === 0) {
			selectedTrip = undefined;
		}
	}

	export let data: PageData;

	let dateNow = String(new Date());

	let formattedTrips: TripFormatted[];

	$: formattedTrips = data.trips.map((trip: Trip) => {
		const timeDifference = calculateTimeDifference(trip.start_time, trip.end_time ?? dateNow);
		const formattedTimeDifference = `${formatMilliseconds(timeDifference)} ${
			trip.end_time ? '' : '(prel.)'
		}`;
		const formattedStartTime = formatDateReadable(trip.start_time);
		const formattedEndTime = trip.end_time ? formatDateReadable(trip.end_time) : '(ej avslutad)';
		const formattedTotalCost = trip.total_cost ? formatPrice(trip.total_cost) : '--';
		const formattedStartCost = trip.start_cost ? formatPrice(trip.start_cost) : '--';
		const formattedVarCost = trip.var_cost
			? formatPrice(trip.var_cost)
			: formatPrice((timeDifference / 1000 / 60) * 3) + ' (prel.)';
		const formattedParkingCost = trip.park_cost ? formatPrice(trip.park_cost) : '--';

		return {
			...trip,
			start_time_formatted: formattedStartTime,
			end_time_formatted: formattedEndTime,
			time_difference_milliseconds: timeDifference,
			time_difference_formatted: formattedTimeDifference,
			total_cost_formatted: formattedTotalCost,
			start_cost_formatted: formattedStartCost,
			var_cost_formatted: formattedVarCost,
			park_cost_formatted: formattedParkingCost
		};
	});

	const categorizeTripsByMonthAndYear = (trips: TripFormatted[]) => {
		const categorizedTrips: { [key: string]: TripFormatted[] } = {};

		trips.forEach((trip) => {
			const startTime = new Date(trip.start_time);
			const month = startTime.toLocaleString('default', { month: 'long' });
			const year = startTime.getFullYear();
			const category = `${month} ${year}`;

			if (!categorizedTrips[category]) {
				categorizedTrips[category] = [];
			}

			categorizedTrips[category].push(trip);
		});

		return categorizedTrips;
	};

	const updateTrip = (e: CustomEvent<TripCompleted>) => {
		const trip = e.detail;
		const index = formattedTrips.findIndex((t) => t.id === trip.id);

		const formattedTrip = formattedTrips[index];
		const formattedTimeDifference = formatMilliseconds(
			calculateTimeDifference(trip.start_time, trip.end_time)
		);

		const updatedTrip = {
			...formattedTrip,
			end_time: trip.end_time,
			end_time_formatted: formatDateReadable(trip.end_time),
			time_difference_formatted: formattedTimeDifference,
			total_cost_formatted: formatPrice(trip.total_cost),
			start_cost_formatted: formatPrice(trip.start_cost),
			var_cost_formatted: formatPrice(trip.var_cost),
			park_cost_formatted: formatPrice(trip.park_cost)
		};
		selectedTrip = updatedTrip;
		formattedTrips = [
			...formattedTrips.slice(0, index),
			updatedTrip,
			...formattedTrips.slice(index + 1)
		];
	};

	$: categorizedTrips = categorizeTripsByMonthAndYear(formattedTrips);
</script>

<TabSwitcher {currentTab}>
	<div class="py-8 space-y-2" slot="tab1">
		{#each Object.entries(categorizedTrips) as [dateCategory, trips]}
			<div class="text-surface-500">
				<div class="border-b border-primary-400 dark:border-primary-900 pl-4">
					<h1 class="text-lg capitalize text-primary-400 dark:text-primary-900">
						{dateCategory}
					</h1>
				</div>
				<div class="divide-y divide-surface-300 dark:divide-surface-800">
					{#each trips as trip}
						<TabButton
							index={1}
							width="w-full"
							classes="flex pl-4 py-2"
							on:tabButtonClick={(e) => handleTabButtonClick(e, trip.id)}
						>
							<div class="grow">
								<div class="text-lg text-surface-700 dark:text-surface-300 flex justify-between">
									<p>
										Avgift
										{trip.time_difference_formatted}
									</p>
									<p>Cykel {trip.bike_id}</p>
								</div>
								<div class="text-surface-500">
									<p>Stad</p>
									<p>{trip.start_time_formatted} - {trip.end_time_formatted}</p>
									<p>{trip.total_cost_formatted}</p>
								</div>
								<div class="text-surface-500 flex justify-between">
									<p>Privat</p>
									<p>Resenr. {trip.id}</p>
								</div>
							</div>
							<div class="h-full my-auto pl-2">
								<span class="block text-surface-500 p-4"><Fa icon={faAngleRight} /></span>
							</div>
						</TabButton>
					{/each}
				</div>
			</div>
		{/each}
	</div>
	<div class="space-y-4" slot="tab2">
		<VerticalTable rows={selectedRows} {headers} />
		<div class="grid grid-cols-2 gap-4 px-2">
			<TabButton
				index={0}
				classes="btn variant-soft-surface w-full"
				on:tabButtonClick={(e) => handleTabButtonClick(e, selectedTrip?.id)}
				><span><Fa icon={faXmark} /></span><span>Visa alla</span></TabButton
			>
			{#if selectedTrip?.id && !selectedTrip?.end_time}
				<EndTripButton on:tripEndedSuccessfully={updateTrip} tripId={selectedTrip.id} />
			{/if}
		</div>
	</div>
</TabSwitcher>
