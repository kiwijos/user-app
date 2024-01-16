<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { cardOptions } from '$lib/utils/cardOptions';
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';

	export let data: PageData;

	const toastStore: ToastStore = getToastStore();

	const toastSettings: ToastSettings = {
		message: 'Din kortuppgifter har uppdaterats',
		timeout: 3000,
		hideDismiss: true,
		background: 'variant-filled-primary'
	};

	export let form: ActionData;

	const countryOptions = [{ name: 'Sverige', value: '1' }];

	let cardTypeError: string = '';
	let cardNumberError: string = '';

	$: if (form?.errors) {
		cardTypeError =
			form.errors.find((error: { field: string; message: string }) => error.field === 'cardType')
				?.message ?? '';
		cardNumberError =
			form.errors.find((error: { field: string; message: string }) => error.field === 'cardNumber')
				?.message ?? '';
	}

	$: if (form?.success) {
		toastStore.trigger(toastSettings);
	}

	const handleSubmit = () => {
		// @ts-expect-error - We wholeheartedly accept this untyped variable
		return async ({ result }) => {
			if (!result?.data.success) return;

			invalidate('server:fetch');
			await applyAction(result); // Apply the action, which will update the form state
		};
	};
</script>

<form
	action="?/updatePaymentMethod"
	method="POST"
	use:enhance={handleSubmit}
	class="flex flex-col gap-2 py-8 px-4"
>
	<div class="space-y-2">
		<p class="text-sm font-bold text-surface-700 dark:text-surface-300">Korttyp</p>
		{#each cardOptions as card, index}
			<label
				class="p-4 border dark:border-surface-800 cursor-pointer rounded-container-token flex items-center space-x-4 [&:has(input:checked)]:variant-soft-primary"
			>
				<span><Fa icon={card.icon} size="lg" /></span>
				<p class="grow">{card.name}</p>
				<input
					class="radio"
					type="radio"
					checked={index + 1 === data?.card?.card_type}
					name="cardType"
					value={card.value}
				/>
			</label>
		{/each}
		<p class="text-error-400">&nbsp;{cardTypeError}</p>
	</div>
	<label class="label">
		<span class="text-sm font-bold text-surface-700 dark:text-surface-300"
			>Ange dina kortuppgifter</span
		>
		<div class="grid rounded-lg grid-rows-2 grid-cols-2">
			<input
				title="Kortnummer"
				class="input !rounded-b-none rounded-t-md col-span-2"
				type="number"
				name="cardNumber"
				placeholder={data?.card?.card_nr ? data.card.card_nr : 'Kortnummer'}
			/>
			<input
				title="Kortet är giltigt t.o.m."
				class="input border-r-transparent !rounded-t-none !rounded-br-none rounded-bl-md col-span-1"
				type="number"
				placeholder="MM / ÅÅ"
				disabled
			/>
			<input
				title="CVC"
				class="input !rounded-t-none !rounded-bl-none rounded-br-md col-span-1"
				type="number"
				placeholder="CVC"
				disabled
			/>
		</div>
		<p class="text-error-400">&nbsp;{cardNumberError}</p>
	</label>
	<label class="label">
		<span class="text-sm font-bold text-surface-700 dark:text-surface-300">Faktureringsadress</span>
		<div class="grid rounded-lg grid-rows-2 grid-cols-1">
			<select
				title="Land"
				class="select border-b-transparent !rounded-b-none rounded-t-md col-span-1"
				value="1"
				disabled
			>
				{#each countryOptions as option}
					<option value={option.value}>{option.name}</option>
				{/each}
			</select>
			<input
				title="Postnummer"
				class="input !rounded-t-none !rounded-t-none rounded-b-md col-span-1"
				type="number"
				placeholder="Postnummer"
				disabled
			/>
		</div>
		<p>&nbsp;</p>
	</label>
	<button
		class="max-w-fit self-end btn variant-filled-primary text-surface-50 dark:text-primary-100"
		type="submit">Spara</button
	>
</form>

<style>
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
