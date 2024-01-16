<script lang="ts">
	import { AppShell } from '@skeletonlabs/skeleton';
	import Navigation from '$lib/components/Navigation.svelte';
	import ParentCrumb from '$lib/components/ParentCrumb.svelte';
</script>

<AppShell slotFooter="z-[999]">
	<svelte:fragment slot="header">
		<ParentCrumb />
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<Navigation />
	</svelte:fragment>
	<slot />
</AppShell>
