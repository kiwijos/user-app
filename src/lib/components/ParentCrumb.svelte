<script lang="ts">
	import { page } from '$app/stores';
	import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
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
		me: 'Start',
		rent: 'Hitta',
		active: 'Aktiva resor',
		STHLM: 'Stockholm',
		GBG: 'Göteborg',
		KRLST: 'Karlstad'
	};

	$: currentPath = (() => {
		const pathParts = $page.url.pathname.split('/');
		const lastPath = pathParts[pathParts.length - 1];
		return names[lastPath] || lastPath;
	})();

	$: directParent = (() => {
		const pathParts = $page.url.pathname.split('/').slice(1);
		const nextToLastPath = pathParts[pathParts.length - 2];
		return {
			label: names[nextToLastPath] || nextToLastPath,
			link: $page.url.pathname.split('/').slice(0, -1).join('/')
		};
	})();
</script>

<div class="{background} {border} {shadow} grid grid-cols-3 place-content-start">
	{#if directParent.label}
		<a
			class="col-start-1 capitalize text-lg btn text-primary-500 w-full justify-start px-2 py-4"
			href={directParent.link}
		>
			<span><Fa icon={faAngleLeft} scale={1.2} /></span><span>{directParent.label}</span>
		</a>
	{/if}
	<p class="col-start-2 capitalize place-self-center text-lg font-medium py-4">{currentPath}</p>
</div>
