<script lang="ts">
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import Navigation from '$lib/components/Navigation.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
</script>

<AppShell slotFooter=" z-[999]">
	<svelte:fragment slot="header">
		<Breadcrumb />
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<Navigation />
	</svelte:fragment>
	<slot />
</AppShell>
