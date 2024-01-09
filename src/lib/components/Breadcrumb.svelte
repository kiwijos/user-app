<script lang="ts">
	import { page } from '$app/stores';

	export let text: string = 'capitalize text-surface-700 dark:text-surface-300';
	export let padding: string = 'px-4 py-2';
	export let background: string = 'bg-surface-50 dark:bg-surface-900';
	export let border: string = 'dark:border-b dark:border-surface-800';
	export let shadow: string = 'drop-shadow-sm dark:shadow-none';

	const names: { [key: string]: string } = {
		account: 'Profil',
		transactions: 'Betalningar',
		payment: 'Kortuppgifter',
		settings: 'Inställningar',
		trips: 'Resor',
		search: 'Sök',
		rent: 'Hyr',
		STHLM: 'Stockholm',
		GBG: 'Göteborg',
		KRLST: 'Karlstad'
	};

	$: myBreadcrumbs = $page.url.pathname
		.split('/')
		.slice(2)
		.map((crumb, i) => {
			return {
				label: names[crumb] || crumb,
				link: $page.url.pathname
					.split('/')
					.slice(0, i + 3)
					.join('/')
			};
		});
	$: size = myBreadcrumbs.length;
</script>

<ol class="breadcrumb {size === 0 ? 'hidden' : ''} {text} {padding} {background} {border} {shadow}">
	{#each myBreadcrumbs as crumb, i}
		{#if i < myBreadcrumbs.length - 1}
			<li class="crumb"><a class="anchor" href={crumb.link}>{crumb.label}</a></li>
			<li class="crumb-separator" aria-hidden>/</li>
		{:else}
			<li class="crumb">{crumb.label}</li>
		{/if}
	{/each}
</ol>
