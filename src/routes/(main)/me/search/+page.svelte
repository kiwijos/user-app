<script lang="ts">
	import SearchInput from '$lib/components/SearchInput.svelte';
	import SearchResults from '$lib/components/SearchResults.svelte';
	import { goto } from '$app/navigation';
	import type { SearchResult } from '$lib/types/SearchResult';

	const searchableLinks: SearchResult[] = [
		{ name: 'Hyr', alias: ['home', 'start', 'hem', 'hyr'], callback: goto, value: '/me' },
		{
			name: 'Profil',
			alias: ['account', 'profile', 'konto'],
			callback: goto,
			value: '/me/account'
		},
		{ name: 'Inställningar', alias: ['settings'], callback: goto, value: '/me/account/settings' },
		{
			name: 'Kortuppgifter',
			alias: ['Payment', 'kontokort', 'betalkort'],
			callback: goto,
			value: '/me/account/payment'
		},
		{
			name: 'Prepay',
			alias: ['överför', 'förbetala', 'förköp'],
			callback: goto,
			value: '/me/account/prepay'
		},
		{
			name: 'Betalningar',
			alias: ['transactions', 'köp', 'transaktioner'],
			callback: goto,
			value: '/me/account/transactions'
		},
		{
			name: 'Resehistorik',
			alias: ['trips', 'historik', 'resor'],
			callback: goto,
			value: '/me/account/trips'
		},
		{ name: 'Logga ut', alias: ['logout', 'sign out'], callback: goto, value: '/logout' }
	];

	let searchResults: SearchResult[] = [];
	let highlightedSubstring = '';

	function handleSearch(e: CustomEvent<string>) {
		const query = e.detail;
		searchResults = searchableLinks.filter(
			(item) =>
				item.name.toLowerCase().includes(query.toLowerCase()) ||
				item.alias.join().includes(query.toLocaleLowerCase())
		);
		highlightedSubstring = query;
	}
</script>

<div class="p-4">
	<SearchInput
		on:search={handleSearch}
		text="text-base"
		classes="w-full"
		placeholder="Sök i appen..."
	/>
</div>
<SearchResults
	results={searchResults}
	{highlightedSubstring}
	noMatchesText="Sök efter sidnamn eller nyckelord."
/>
