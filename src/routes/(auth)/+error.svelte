<script lang="ts">
	import { page } from '$app/stores';
	import Fa from 'svelte-fa';
	import { faArrowRotateBack } from '@fortawesome/free-solid-svg-icons';
</script>

<h1 class="text-center text-4xl font-extrabold">Nåt gick fel</h1>
<h2 class="text-center h3 font-medium text-surface-500">
	{$page.error?.message}
</h2>
<a
	href="/"
	title="Tillbaka till inloggning"
	class="btn rounded-container-token w-full md:max-w-72 p-4 bg-surface-900 border border-surface-800 flex items-center justify-center space-x-2 text-surface-700 dark:text-surface-300"
	><span><Fa icon={faArrowRotateBack} /></span><span>Tillbaka till inloggning</span></a
>
