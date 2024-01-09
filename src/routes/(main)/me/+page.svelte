<script lang="ts">
	import Draggable from '$lib/components/Draggable.svelte';
	import Fa from 'svelte-fa';
	import { faLocationArrow, faCity, faXmark } from '@fortawesome/free-solid-svg-icons';
	import SearchInput from '$lib/components/SearchInput.svelte';
	import SearchResults from '$lib/components/SearchResults.svelte';

	import type { SearchResult } from '$lib/types/SearchResult';

	let snapTo: { left: number; top: number };

	let searchResults: SearchResult[] = [];
	let highlightedSubstring = '';

	let searchableFeatures = [
		{
			name: 'Stockholm',
			alias: ['STHLM'],
			callback: handleSearchClose,
			value: undefined
		},
		{
			name: 'Göteborg',
			alias: ['GBG'],
			callback: handleSearchClose,
			value: undefined
		},
		{
			name: 'Karlstad',
			alias: ['KRLST'],
			callback: handleSearchClose,
			value: undefined
		}
	];

	function handleSearch(e: CustomEvent<string>) {
		const query = e.detail;
		searchResults = searchableFeatures.filter(
			(item) =>
				item.name.toLowerCase().includes(query.toLowerCase()) ||
				item.alias.join().includes(query.toLocaleLowerCase())
		);
		highlightedSubstring = query;
	}

	function handleClick(e: MouseEvent) {
		snapTo = { left: 0, top: 500 };
	}

	let searching = false;

	function handleSearchOpen(e: MouseEvent) {
		if (searching) return;
		searching = true;
		snapTo = { left: 0, top: 32 };
	}

	function handleSearchClose(e: MouseEvent) {
		if (!searching) return;
		searchResults = [];
		searching = false;
		snapTo = { left: 0, top: 500 };
	}

	const noMatchesHTML: string = `
    <div
        class="text-center text-surface-500 h-full flex flex-col items-center justify-center gap-4"
    >
        <p>Hitta den cykel du letar efter genom att söka på cykelkod eller stadsnamn.</p>
        <p>
            T.ex. <span class="text-surface-700 dark:text-surface-300">404</span> eller
            <span class="text-surface-700 dark:text-surface-300">Stockholm</span>
        </p>
    </div>`;
</script>

<Draggable
	zIndex="1"
	initialLeft={0}
	initialTop={500}
	snapBottom={140}
	snapMiddle={500}
	snapTop={8}
	{snapTo}
>
	<div
		class="w-full h-lvh bg-surface-100 dark:bg-surface-900 shadow-[0_50px_50px_6px_rgba(0,0,0,0.3)] shadow-black rounded-t-3xl"
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
						placeholder="Sök cykelkod eller stad..."
					/>
					<button class="btn-icon shrink variant-soft-surface" on:click={handleSearchClose}
						><Fa icon={faXmark} /></button
					>
				</div>
			{:else}
				<button
					class="w-full px-4 py-2 text-left text-surface-400 rounded-full bg-surface-50 border dark:border-surface-800 dark:bg-surface-800"
					on:click={handleSearchOpen}>Sök cykelkod eller stad...</button
				>
				<div class="w-full grid grid-cols-2 gap-2">
					<button
						class="btn variant-filled-primary text-surface-50 dark:text-primary-100"
						on:click={handleClick}
						><span><Fa icon={faLocationArrow} /></span><span>I närheten</span></button
					>
					<button class="btn variant-soft-surface" on:click={handleClick}
						><span><Fa icon={faCity} /></span><span>Välj stad</span></button
					>
				</div>
			{/if}
		</div>
		<div class="h-full">
			{#if searching}
				<SearchResults results={searchResults} {highlightedSubstring} {noMatchesHTML} />
			{:else}
				<div class="text-center text-surface-500 mt-4">
					<p>Svep och klicka för att navigera och hitta cyklar i närheten av dig.</p>
				</div>
			{/if}
		</div>
	</div>
</Draggable>
