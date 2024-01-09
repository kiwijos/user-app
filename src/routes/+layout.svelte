<script lang="ts">
	import '../app.pcss';
	import { autoModeWatcher, LightSwitch } from '@skeletonlabs/skeleton';
	import { Toast } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';

	initializeStores();
</script>

<svelte:head>
	{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
</svelte:head>
<Toast position="t" />
<slot />
<div class="fixed bottom-10 right-0 z-50 p-4">
	<LightSwitch />
</div>
