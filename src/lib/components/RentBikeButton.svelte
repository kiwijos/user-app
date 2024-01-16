<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { appendItem } from '$lib/stores/currentTrips';
	import Fa from 'svelte-fa';
	import { faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
	/**
	 * This is the selected bike id
	 * @type {number}
	 */
	export let bikeId: number | string;

	/**
	 * This is the title attribute of the submit button
	 * @type {string}
	 */
	export let buttonTitle: string = `Låna cykel ${bikeId}`;

	/**
	 * This is the width of the button
	 * @type {string}
	 */
	export let width: string = 'w-full';
	export let buttonClass: string =
		'btn variant-filled-primary text-surface-50 dark:text-primary-100';
	export let classes: string = '';
	export let buttonName: string = 'Hyr cykel';
	export let formClass: string = '';

	// @ts-expect-error - We wholeheartedly accept these untyped and unused variables
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleSubmit = ({ formElement, formData, action, cancel, submitter }) => {
		if (formData.get('bikeId') != bikeId) {
			cancel();
			return;
		}

		// @ts-expect-error - We wholeheartedly accept this untyped variable too
		return async ({ result }) => {
			if (!result?.data?.success) return;

			appendItem(result.data.trip); // Store the the whole trip object

			await applyAction(result); // Apply the action, which will update the form state
		};
	};
</script>

<form method="POST" class={formClass} action="/me/rent?/rentBike" use:enhance={handleSubmit}>
	<button title={buttonTitle} type="submit" class="{width} {buttonClass} {classes}"
		><span><Fa icon={faUnlockAlt} /></span><span>{buttonName}</span></button
	>
	<input type="hidden" name="bikeId" value={bikeId} />
</form>
