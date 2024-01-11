<script lang="ts">
	import type { SearchResult } from '$lib/types/SearchResult';

	export let results: SearchResult[] = [];
	export let highlightedSubstring = '';

	/** The background and text style of the highlighted substring
	 * default: 'variant-soft-primary font-bold'
	 * @type {string}
	 */
	export let highlight: string = 'variant-soft-primary font-bold';

	function highlightSubstring(text: string, substring: string) {
		if (!substring) return text;
		const regex = new RegExp(`(${substring})`, 'gi');
		return text
			.split(regex)
			.map((part, index) => (index % 2 === 0 ? part : `<span class="${highlight}">${part}</span>`))
			.join('');
	}
</script>

{#if results.length > 0}
	<div class="overflow-auto">
		{#each results as result}
			<button
				class="w-full flex flex-col px-4 py-2 border-b dark:border-surface-800 last:border-none text-surface-700 dark:text-surface-300 hover:bg-surface-200 hover:dark:bg-surface-800 hover:dark:text-white"
				on:click={() => result.callback(result.value)}
				><span class="text-xl">{@html highlightSubstring(result.name, highlightedSubstring)}</span>
				<span class="text-base text-surface-500 dark:text-surface-500"
					>{@html highlightSubstring(result.alias.join(' '), highlightedSubstring)}</span
				></button
			>
		{/each}
	</div>
{:else}
	<slot name="noMatches" />
{/if}
