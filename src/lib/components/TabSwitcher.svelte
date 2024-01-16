<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let tabs = ['Tab 1', 'Tab 2'];
	export let currentTab: number = 0;

	const dispatch = createEventDispatcher();

	$: if (currentTab) switchTab(currentTab);

	function switchTab(index: number) {
		if (index !== currentTab) {
			currentTab = index;
			dispatch('tabChange', { index });
		}
	}
</script>

<div class="relative overflow-x-hidden">
	<div
		class="flex transition-transform duration-300 ease-in-out"
		style="transform: translateX({currentTab * -100}%)"
	>
		{#each tabs as tab, index (tab)}
			<div role="tab" class="shrink-0 w-full" aria-hidden={index !== currentTab}>
				{#if index === 0}
					<slot name="tab1" />
				{:else}
					<slot name="tab2" />
				{/if}
			</div>
		{/each}
	</div>
</div>
