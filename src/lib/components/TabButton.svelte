<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let index = 0;

	/** The width of the tab button */
	export let width: string = 'w-fit';
	export let height: string = 'h-fit';
	/** The text alignment of the tab button */
	export let textAlign: string = 'text-left';
	export let classes: string = '';

	const dispatch = createEventDispatcher();

	function handleClick() {
		dispatch('tabButtonClick', { index });
	}
</script>

<button class="{width} {height} {textAlign} {classes}" on:click|preventDefault={handleClick}>
	<slot />
</button>
