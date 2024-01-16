<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import PaymentCardButton from '$lib/components/PaymentCardButton.svelte';
	import { invalidate } from '$app/navigation';

	export let data: PageData;

	const toastStore: ToastStore = getToastStore();

	const toastSettings: ToastSettings = {
		message: 'Överföring lyckades!',
		timeout: 2000,
		hideDismiss: true,
		background: 'variant-filled-primary'
	};

	export let form: ActionData;

	let amountError: string = '';

	$: if (form?.errors) {
		amountError =
			form.errors.find((error: { field: string; message: string }) => error.field === 'amount')
				?.message ?? '';
	}

	$: if (form?.success) {
		toastStore.trigger(toastSettings);
	}

	let hasSetupPaymentMethod: boolean = typeof data?.card?.card_type === 'number';

	// @ts-expect-error - untyped variables are fine
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const handleSubmit = ({ formElement, formData, action, cancel, submitter }) => {
		if (!hasSetupPaymentMethod) cancel();

		// @ts-expect-error - We wholeheartedly accept this untyped variable
		return async ({ result }) => {
			if (!result?.data.success) return;

			invalidate('server:fetch');
			await applyAction(result); // Apply the action, which will update the form state
		};
	};

	let canSubmit: boolean = false;

	const onValueChange = (e: Event) => {
		const value = Number((e.target as HTMLInputElement).value);
		if (value > 0) canSubmit = true;
		else canSubmit = false;
	};
</script>

<form
	action="?/prepay"
	method="POST"
	use:enhance={handleSubmit}
	class="flex flex-col space-y-4 gap-2 py-8 px-4"
>
	<PaymentCardButton card={data?.card} />
	<label class="label">
		<span class="text-sm font-bold text-surface-700 dark:text-surface-300">Belopp</span>
		<input
			class="input text-4xl dark:border-surface-800 bg-surface-100 dark:bg-surface-900 text-surface-700 dark:text-surface-300 py-4 px-4"
			title="Input (belopp)"
			type="number"
			placeholder="kr"
			name="amount"
			on:change={onValueChange}
			disabled={!hasSetupPaymentMethod}
		/>
		<p class="text-error-400 text-xs">&nbsp; {amountError || ''}</p>
	</label>
	<button
		class="max-w-fit self-end btn variant-filled-primary text-surface-50 dark:text-primary-100"
		disabled={!hasSetupPaymentMethod || !canSubmit}
		title="Överför"
		type="submit">Överför</button
	>
</form>
