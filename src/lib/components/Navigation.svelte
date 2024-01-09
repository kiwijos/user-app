<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Fa from 'svelte-fa';
	import { faBiking, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';

	const paths = [
		{ name: 'Hyr', path: '/me', icon: faBiking },
		{ name: 'Sök', path: '/me/search', icon: faSearch },
		{ name: 'Profil', path: '/me/account', icon: faUser }
	];
</script>

<nav
	class="flex w-full bg-surface-50 dark:bg-surface-900 dark:border-t dark:border-surface-800 text-surface-700 dark:text-surface-300"
>
	{#each paths as { name, path, icon }}
		<button
			class="btn grow text-lg first:justify-end last:justify-start {$page.url.pathname === path
				? '!text-primary-500'
				: ''}"
			aria-current={$page.url.pathname === path ? 'page' : null}
			on:click={() => goto(path)}
			><span
				class="rounded-full w-10 h-10 flex items-center justify-center bg-surface-100 dark:bg-surface-800"
				><Fa {icon} fw /></span
			><span class="sr-only">{name}</span></button
		>
	{/each}
</nav>
