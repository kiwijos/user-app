<script lang="ts">
	export let headers: string[] = ['Header 1', 'Header 2'];
	export let rows: (string | number)[][] = [
		['Row 1', 'Row 2'],
		['Row 3', 'Row 4']
	];
</script>

<table class="w-full text-left border-b border-t dark:border-surface-800">
	<tbody class="overflow-y-scroll text-surface-700 dark:text-surface-300">
		{#each rows as row}
			{#each row as cell, index}
				<tr class="text-lg odd:bg-surface-50 odd:dark:bg-surface-500/5">
					<td class="px-4 py-2">{headers[index]}</td>
					<td class="px-4 py-2">{cell}</td>
				</tr>
			{/each}
		{/each}
	</tbody>
</table>
