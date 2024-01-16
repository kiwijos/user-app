<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { removeItem } from '$lib/stores/currentTrips';
	import { createEventDispatcher } from 'svelte';
	/**
	 * This is the current trip id
	 * @type {number | string}
	 */
	export let tripId: number | string;

	/**
	 * This is the title attribute of the submit button
	 * @type {string}
	 */
	export let buttonTitle: string = `Lämna tillbaka cykeln och avsluta din resa`;

	/**
	 * This is the width of the button
	 * @type {string}
	 */
	export let width: string = 'w-full';

	/**
	 * This is the class of the button
	 * default: 'btn variant-filled-warning'
	 * @type {string}
	 */
	export let buttonClass: string = 'btn variant-filled-warning';

	/**
	 * This is the text on the button
	 * default: 'Avsluta resa'
	 * @type {string}
	 */
	export let buttonName: string = 'Avsluta resa';

	/**
	 * Arbitrary classes to add to the form element
	 * @type {string}
	 */
	export let formClass: string = '';

	/**
	 * Arbitrary classes to add to the button element
	 * @type {string}
	 */
	export let classes: string = '';

	const dispatch = createEventDispatcher();

	// @ts-expect-error - We wholeheartedly accept these untyped and unused variables
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleSubmit = ({ formElement, formData, action, cancel, submitter }) => {
		if (formData.get('tripId') != tripId) {
			cancel();
			return;
		}

		// @ts-expect-error - We wholeheartedly accept this untyped variable too
		return async ({ result }) => {
			if (!result?.data?.success) return;

			removeItem(result.data.trip.id); // Remove the trip from the currentTrip store

			dispatch('tripEndedSuccessfully', result.data.trip); // Dispatch an event to the parent component

			await applyAction(result); // Apply the action, which will update the form state
		};
	};
</script>

<form method="POST" class={formClass} action="/me/rent?/endTrip" use:enhance={handleSubmit}>
	<button title={buttonTitle} type="submit" class="{width} {buttonClass} {classes}"
		>{buttonName}</button
	>
	<input type="hidden" name="tripId" value={tripId} />
</form>
