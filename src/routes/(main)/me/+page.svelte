<script lang="ts">
	import maplibregl, { type Map as MaplibreMap } from 'maplibre-gl';
	import type { PageData } from './$types';
	import type { CityFeature } from '$lib/types/CityFeature';
	import type { ZoneFeature } from '$lib/types/ZoneFeature';
	import type { BikeFeature } from '$lib/types/BikeFeature';

	import Map from '$lib/components/Map.svelte';
	import { mapStore } from '$lib/stores/map';
	import Draggable from '$lib/components/Draggable.svelte';
	import Fa from 'svelte-fa';
	import { faLocationArrow, faQrcode, faXmark } from '@fortawesome/free-solid-svg-icons';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import SearchResults from '$lib/components/SearchResults.svelte';

	import RentBikeButton from '$lib/components/RentBikeButton.svelte';
	import EndTripButton from '$lib/components/EndTripButton.svelte';
	import BatteryMeter from '$lib/components/BatteryMeter.svelte';

	import currentTrips from '$lib/stores/currentTrips';

	import type { SearchResult } from '$lib/types/SearchResult';

	export let data: PageData;

	// Get the map from the store
	let map: MaplibreMap;
	mapStore.subscribe((value) => {
		map = value;
	});

	let selectedBike: BikeFeature['properties'] | undefined;

	let snapTo: string;

	let searchResults: SearchResult[] = [];
	let highlightedSubstring = '';

	function fitToCity(polygonCoordinates: [number, number][][]) {
		handleSearchClose();

		// Create an initial bounding box with the first coordinate of the first ring
		const initialBounds = new maplibregl.LngLatBounds(
			polygonCoordinates[0][0],
			polygonCoordinates[0][0]
		);

		// Extend the bounding box to include all polygon coordinates
		const bounds = polygonCoordinates.reduce((outerBounds, ring) => {
			return ring.reduce((innerBounds, coord) => innerBounds.extend(coord), outerBounds);
		}, initialBounds);

		// Fit the map to the calculated bounds with padding
		map.fitBounds(bounds, {
			padding: 20
		});
	}

	function fitToBike(pointCoordinates: [number, number]) {
		handleSearchClose();

		map.flyTo({
			center: pointCoordinates,
			zoom: 16
		});
	}

	let searchableFeatures: SearchResult[] = data.cities.map((city: CityFeature) => {
		return {
			name: city.properties.name,
			alias: [city.properties.id],
			callback: fitToCity,
			value: city.geometry.coordinates
		};
	});

	data.bikes.forEach((bike: BikeFeature) => {
		searchableFeatures.push({
			name: `Cykel ${bike.properties.id}`,
			alias: [bike.properties.city_id],
			callback: fitToBike,
			value: bike.geometry.coordinates
		});
	});

	function handleSearch(e: CustomEvent<string>) {
		const query = e.detail;
		searchResults = searchableFeatures.filter(
			(item) =>
				item.name.toLowerCase().includes(query.toLowerCase()) ||
				item.alias.join().toLowerCase().includes(query.toLowerCase())
		);
		highlightedSubstring = query;
	}

	let searching = false;

	function handleSearchOpen() {
		if (searching) return;
		searching = true;
		snapTo = 'top';
	}

	function handleSearchClose() {
		if (!searching) return;
		searchResults = [];
		searching = false;
		snapTo = 'bottom';
	}

	const colorMap = {
		'primary-50': 'rgb(239, 246, 255)',
		'primary-100': 'rgb(219, 234, 254)',
		'primary-200': 'rgb(191, 219, 254)',
		'primary-300': 'rgb(147, 197, 253)',
		'primary-400': 'rgb(96, 165, 250)',
		'primary-500': 'rgb(59, 130, 246)',
		'primary-600': 'rgb(37, 99, 235)',
		'primary-700': 'rgb(29, 78, 216)',
		'primary-800': 'rgb(30, 64, 175)',
		'primary-900': 'rgb(30, 58, 138)'
	};

	const zoneOptions: { fill_color: string; label: string; line_color: string }[] = [
		{
			fill_color: '#0ea5e9',
			label: 'Parkering',
			line_color: '#0c4a6e'
		},
		{
			fill_color: '#10b981',
			label: 'Laddning',
			line_color: '#064e3b'
		},
		{
			fill_color: '#ef4444',
			label: 'Förbjuden',
			line_color: '#7f1d1d'
		}
	];

	$: if (map) {
		map.on('load', () => {
			if (!map.getSource('cities')) {
				map.addSource('cities', {
					type: 'geojson',
					data: { type: 'FeatureCollection', features: data.cities }
				});
			}

			data.cities.forEach((feature: CityFeature) => {
				const borderLayerID = `${feature.properties.id}-border`;

				if (!map.getLayer(borderLayerID)) {
					map.addLayer({
						id: borderLayerID,
						type: 'line',
						source: 'cities',
						layout: {},
						paint: {
							'line-color': '#4f46e5',
							'line-width': 2,
							'line-opacity': 0.5
						},
						filter: ['==', 'id', feature.properties.id]
					});
				}
			});

			if (!map.getSource('zones')) {
				map.addSource('zones', {
					type: 'geojson',
					data: {
						type: 'FeatureCollection',
						features: data.zones
					}
				});
			}

			// Insert the zone layers beneath any symbol layer with a "text-field" property.
			const layers = map.getStyle().layers;

			let labelLayerId: string;
			for (let i = 0; i < layers.length; i++) {
				// @ts-expect-error - we are aware that it might be undefined
				if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
					labelLayerId = layers[i].id;
					break;
				}
			}

			data.zones.forEach((feature: ZoneFeature) => {
				const zoneDescr: string = feature.properties.descr;
				const index: number = feature.properties['zone_id'] - 1;

				// Add a layer for this type (parking/charging/forbidden) if it hasn't been added already.
				const fillLayerID = `${zoneDescr}-fill`;

				if (!map.getLayer(fillLayerID)) {
					map.addLayer(
						{
							id: fillLayerID,
							type: 'fill',
							source: 'zones',
							layout: {},
							paint: {
								'fill-color': zoneOptions[index].fill_color,
								'fill-opacity': ['interpolate', ['exponential', 2], ['zoom'], 10, 0, 13, 0.4]
							},
							filter: ['==', 'descr', zoneDescr]
						},
						labelLayerId // insert before the label layer id
					);
				}

				// Add a border layer for this type (parking/charging/forbidden) if it hasn't been added already.
				const borderLayerId = `${zoneDescr}-border`;

				if (!map.getLayer(borderLayerId)) {
					map.addLayer(
						{
							id: borderLayerId,
							type: 'line',
							source: 'zones',
							layout: {},
							paint: {
								'line-color': zoneOptions[index].line_color,
								'line-width': 2,
								'line-opacity': ['interpolate', ['exponential', 2], ['zoom'], 11, 0, 13, 0.9]
							},
							filter: ['==', 'descr', zoneDescr]
						},
						labelLayerId // insert before the label layer id
					);
				}
			});

			// Add bikes layer

			if (!map.getSource('bikes')) {
				map.addSource('bikes', {
					type: 'geojson',
					data: {
						type: 'FeatureCollection',
						features: data.bikes
					},
					cluster: true,
					clusterMaxZoom: 15, // Max zoom to cluster points on
					clusterRadius: 30 // Radius of each cluster when clustering points (defaults to 50)
				});
			}

			if (!map.getLayer('clusters')) {
				map.addLayer({
					id: 'clusters',
					type: 'circle',
					source: 'bikes',
					filter: ['==', 'cluster', true],
					paint: {
						// Use step expressions (https://maplibre.org/maplibre-style-spec/#expressions-step)
						// with three steps to implement three types of circles:
						//   * Light blue, 12px circles when point count is less than 100
						//   * Medium blue, 18px circles when point count is between 100 and 750
						//   * Dark blue, 24px circles when point count is greater than or equal to 750
						'circle-color': [
							'step',
							['get', 'point_count'],
							colorMap['primary-400'],
							100,
							colorMap['primary-500'],
							750,
							colorMap['primary-600']
						],
						'circle-radius': ['step', ['get', 'point_count'], 12, 100, 18, 750, 24],
						'circle-stroke-width': 1,
						'circle-stroke-color': '#fff'
					}
				});
			}

			if (!map.getLayer('cluster-count')) {
				map.addLayer({
					id: 'cluster-count',
					type: 'symbol',
					source: 'bikes',
					filter: ['==', 'cluster', true],
					layout: {
						'icon-allow-overlap': true,
						'text-field': '{point_count_abbreviated}',
						'text-font': ['Arial Unicode MS Bold'],
						'text-size': 12
					},
					paint: {
						'text-color': '#fff'
					}
				});
			}

			// inspect a cluster on click
			map.on('click', 'clusters', (e) => {
				const features = map.queryRenderedFeatures(e.point, {
					layers: ['clusters']
				});
				const clusterId = features[0].properties.cluster_id;

				// @ts-expect-error - getSource is not in the typings
				map.getSource('bikes').getClusterExpansionZoom(clusterId, (err, zoom) => {
					if (err) return;

					map.easeTo({
						// @ts-expect-error - The features have a geometry, I've just not typed it out here
						center: features[0].geometry.coordinates,
						zoom
					});
				});
			});

			// We use these points to give the user larger targets to click on
			// The visual markers are smaller
			if (!map.getLayer('unclustered-points')) {
				map.addLayer({
					id: 'unclustered-points',
					type: 'circle',
					source: 'bikes',
					filter: ['!=', 'cluster', true],
					paint: {
						'circle-color': 'rgba(0, 0, 0, 0)',
						'circle-radius': 18
					}
				});
			}

			// Add a click handler to the bikes layer that opens a popup showing the bikes' name
			map.on('click', 'unclustered-points', (e) => {
				if (!e.features || !e.features[0]) return;

				const props = <BikeFeature['properties']>e.features[0].properties;

				if (selectedBike && selectedBike.id === props.id) return;

				snapTo = 'middle';
				selectedBike = props;
			});

			// Cache and keep track of markers for better performance
			const markers: { [key: number]: maplibregl.Marker } = {};
			let markersOnScreen: { [key: number]: maplibregl.Marker } = {};

			function updateMarkers() {
				const newMarkers: { [key: number]: maplibregl.Marker } = {};

				// @ts-expect-error - Out custom feature type is compatible with MapGeoJsonFeature for our intents and purposes, this is fine
				const features: BikeFeature[] = map.querySourceFeatures('bikes');

				// for every unclustered point, create an HTML marker
				// and add it to the map if it's not there already
				for (let i = 0; i < features.length; i++) {
					const coords = features[i].geometry.coordinates;
					const props = features[i].properties;

					if (props.cluster) continue;
					const id = props.id;

					let marker = markers[id];
					if (!marker) {
						const el: HTMLElement = createMapPin(coords);
						const popup = new maplibregl.Popup({ offset: 15 }).setHTML(
							`<span class="px-2 py-1 rounded-container-token font-bold bg-primary-800 text-primary-50">${props.id}</span>`
						);
						popup.on('close', () => {
							if (selectedBike && selectedBike.id === props.id) {
								selectedBike = undefined;
								snapTo = 'bottom';
							}
						});
						marker = markers[id] = new maplibregl.Marker({ element: el })
							.setLngLat(coords)
							.setPopup(popup);
					}
					newMarkers[id] = marker;

					if (!markersOnScreen[id]) marker.addTo(map);
				}
				// for every marker we've added previously, remove those that are no longer visible
				for (const id in markersOnScreen) {
					if (!newMarkers[id]) markersOnScreen[id].remove();
				}
				markersOnScreen = newMarkers;
			}

			// Update markers when the GeoJSON data is loaded and on every map move/moveend
			map.on('data', (e) => {
				// @ts-expect-error - I put my fate in the Maplibre tutorial and assume these properties exist (it seems to work fine)
				if (e.sourceId !== 'bikes' || !e.isSourceLoaded) return;

				map.on('move', updateMarkers);
				map.on('moveend', updateMarkers);
				updateMarkers();
			});

			function createMapPin(coords: [number, number]): HTMLElement {
				const pinSize = 32; // Adjust the size of the pin
				const circleRadius = 14; // Adjust the radius of the outer circle
				const svgPathSize = 16; // Adjust the size of the inner SVG
				const circleFill = 'fill-primary-500'; // Replace with the desired fill color
				const circleStroke = 'white'; // Replace with the desired stroke color
				const bikeStroke = 'white'; // Replace with the desired stroke color

				const svgMarkup = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="${pinSize}" height="${pinSize}" viewBox="0 0 ${pinSize} ${pinSize}" fill="none">
                        <!-- Outer circle -->
                        <circle cx="${pinSize / 2}" cy="${
													pinSize / 2
												}" r="${circleRadius}" stroke="${circleStroke}" stroke-width="2" fill="none" class="${circleFill}" />

                        <!-- Inner SVG with transparent background -->
                        <svg x="${(pinSize - svgPathSize) / 2}" y="${
													(pinSize - svgPathSize) / 2
												}" width="${svgPathSize}" height="${svgPathSize}" viewBox="0 0 ${pinSize} ${pinSize}" fill="none">
                            <!-- Bike icon SVG -->
                            <path d="M8.014 5H12a1 1 0 1 1 0 2H8.905l-.998 9.983l5.666 6.918A3 3 0 0 0 15.894 25h6.232A4.002 4.002 0 0 1 30 26a4 4 0 0 1-7.874 1h-6.232a5 5 0 0 1-3.868-1.832l-4.4-5.373l-.245 2.45A4.002 4.002 0 0 1 6 30a4 4 0 0 1-.61-7.954L7.004 5.911a.994.994 0 0 1 .65-.85a.994.994 0 0 1 .36-.061M5.177 24.177a2 2 0 1 0 1.99.199l-.172 1.723a1 1 0 0 1-1.99-.199zM24.267 27a2 2 0 1 0 0-2H26a1 1 0 1 1 0 2z" fill="${bikeStroke}"/>
                        </svg>
                    </svg>
                `;

				const el = document.createElement('div');
				el.classList.add('cursor-pointer');

				el.addEventListener('click', () => {
					map.easeTo({ center: coords });
				});
				el.innerHTML = svgMarkup;

				return el;
			}
		});
	}
</script>

<Draggable
	zIndex="z-[998]"
	initialLeft={0}
	initialTop={500}
	snapBottom={200}
	snapMiddle={500}
	snapTop={8}
	{snapTo}
>
	<div
		class="w-full h-lvh overflow-hidden bg-surface-100 dark:bg-surface-900 shadow-[0_50px_50px_6px_rgba(0,0,0,0.3)] shadow-black rounded-t-3xl"
	>
		<div class="flex flex-col items-center gap-4 p-2 border-b dark:border-surface-800">
			<span aria-hidden class="block w-16 h-2 rounded-full bg-surface-300 dark:bg-surface-700"
			></span>
			{#if searching}
				<div class="flex gap-2 w-full">
					<SearchInput
						on:search={handleSearch}
						focusInput={true}
						text="text-base"
						classes="grow"
						placeholder="Sök efter cykelkod eller stad"
					/>
					<button class="btn-icon shrink variant-soft-surface" on:click={handleSearchClose}
						><Fa icon={faXmark} /></button
					>
				</div>
			{:else}
				<button
					class="w-full px-4 py-2 text-left text-surface-400 rounded-full bg-surface-50 border dark:border-surface-800 dark:bg-surface-800"
					on:click={handleSearchOpen}>Sök efter cykelkod eller stad</button
				>
				{#if selectedBike === undefined}
					<div class="w-full grid grid-cols-2 gap-2">
						<button class="btn variant-filled-primary text-surface-50 dark:text-primary-100"
							><span><Fa icon={faLocationArrow} /></span><span>I närheten</span></button
						>
						<button class="btn variant-soft-surface"
							><span><Fa icon={faQrcode} /></span><span>Scanna</span></button
						>
					</div>
				{/if}
			{/if}
		</div>
		<div class="h-3/4 overflow-y-scroll">
			<!-- Searching takes presedence -->
			{#if searching}
				<SearchResults results={searchResults} {highlightedSubstring}>
					<div slot="noMatches" class="text-center text-surface-500 space-y-4 py-16 px-4">
						<p>Hitta den cykel du letar efter genom att söka på cykelkod eller stadsnamn.</p>
						<p>
							T.ex. <span class="text-surface-700 dark:text-surface-300">404</span> eller
							<span class="text-surface-700 dark:text-surface-300">Stockholm</span>
						</p>
					</div>
				</SearchResults>
			{:else if selectedBike}
				{@const rented = $currentTrips.find((trip) => trip.bike_id === selectedBike?.id)}
				<div class="m-2 px-2 py-4 rounded-container-token bg-surface-50 dark:bg-surface-800">
					<div class="grid grid-cols-2 gap-4 items-end">
						<div class="space-y-2">
							<p class="ml-2 text-surface-700 dark:text-surface-300 text-2xl font-extrabold">
								Cykelnr #{selectedBike.id}
							</p>
							<BatteryMeter height="h-8" value={selectedBike.charge_perc * 100} />
						</div>
						{#if rented}
							<EndTripButton tripId={rented.id} />
						{:else}
							<RentBikeButton bikeId={selectedBike.id} />
						{/if}
					</div>
				</div>
			{:else}
				<div class="text-center text-surface-500 mt-4">
					<p>
						Svep och klicka eller använd <span
							class="inline-block pb-1 leading-none ring-1 dark:ring-0 ring-surface-500 bg-surface-50 dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-sm w-5 h-5"
							>⌖</span
						> för att hitta cyklar i närheten av dig.
					</p>
				</div>
			{/if}
		</div>
	</div>
</Draggable>
<Map />
