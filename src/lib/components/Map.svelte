<script lang="ts">
	import { Map } from 'maplibre-gl';
	import { PUBLIC_MAPTILER_API_KEY } from '$env/static/public';
	import { GeolocateControl } from 'maplibre-gl';
	import { mapStore } from '$lib/stores/map';

	let mapContainer: HTMLDivElement;

	/** The width of the map container */
	export let width = 'w-full';

	/** The height of the map container */
	export let height = 'h-full';

	$: if (mapContainer) {
		const initialState = { lat: 59.0, lng: 15.0, zoom: 5 };

		const map: Map = new Map({
			container: mapContainer,
			style: `https://api.maptiler.com/maps/dataviz/style.json?key=${PUBLIC_MAPTILER_API_KEY}`,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom,
			attributionControl: true
		});
		map.addControl(
			new GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true
				},
				trackUserLocation: true
			})
		);

		mapStore.set(map);
	}
</script>

<div class="relative {width} {height}">
	<a href="https://www.maptiler.com" class="watermark" target="_blank" rel="noopener"
		><img src="https://api.maptiler.com/resources/logo.svg" alt="MapTiler logo" /></a
	>
	<div class="map" bind:this={mapContainer} />
</div>

<style>
	@import 'maplibre-gl/dist/maplibre-gl.css';

	.map {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.watermark {
		position: absolute;
		left: 10px;
		bottom: 10px;
		z-index: 1;
	}
</style>
