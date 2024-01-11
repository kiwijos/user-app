<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	/**
	 * The roundedness of the input
	 * default: 'rounded-full'
	 * @type {string}
	 */
	export let rounded: string = 'rounded-full';

	/**
	 * The size of the input and other text styles
	 * default: 'text-xs'
	 * @type {string}
	 */
	export let text: string = 'text-xs';

	/**
	 * The padding of the input
	 * default: 'px-4 py-2'
	 * @type {string}
	 */
	export let padding: string = 'px-4 py-2';

	/**
	 * The border of the input
	 * default: 'border border-gray-300 dark:border-surface-800'
	 * @type {string}
	 */
	export let border: string = 'border border-gray-300 dark:border-surface-800';

	/**
	 * The focus styles of the input
	 * default: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-surface-500'
	 * @type {string}
	 */
	export let focus: string =
		'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:focus:ring-surface-500';

	/**
	 * The background of the input
	 * default: 'bg-surface-50 dark:bg-surface-800'
	 * @type {string}
	 */
	export let background: string = 'bg-surface-50 dark:bg-surface-800';

	/** Arbitrary classes to add to the input
	 * @type {string}
	 */
	export let classes: string = '';

	/**
	 * The placeholder of the input
	 * default: 'Sök...'
	 * @type {string}
	 */
	export let placeholder: string = 'Sök...';

	/**
	 * Whether or not the input should be focused on mount
	 * default: true
	 * @type {boolean}
	 */
	export let focusInput: boolean = true;

	const dispatch = createEventDispatcher();
	let searchQuery = '';

	let searchInput: HTMLInputElement;

	onMount(() => {
		if (focusInput) searchInput.focus();
	});

	function handleInput() {
		dispatch('search', searchQuery);
	}
</script>

<input
	type="text"
	bind:this={searchInput}
	class="{classes} {rounded} {background} {text} {padding} {border} {focus}"
	bind:value={searchQuery}
	on:input|preventDefault={handleInput}
	{placeholder}
/>
