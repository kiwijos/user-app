<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="h-full flex flex-col justify-center items-center">
	<h1 class="text-center text-4xl font-extrabold">Nåt gick fel</h1>
	<h2 class="text-center h3 font-medium text-surface-500">
		{$page.error?.message}
	</h2>
</div>
