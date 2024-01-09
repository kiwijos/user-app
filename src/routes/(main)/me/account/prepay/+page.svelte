<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
	import { cardOptions } from '$lib/utils/cardOptions';
	import type { PageData } from './$types';

	export let data: PageData;

	const toastStore: ToastStore = getToastStore();

	const toastSettings: ToastSettings = {
		message: 'Överföring lyckades!',
		timeout: 2000,
		hideDismiss: true,
		background: 'variant-soft-success'
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
</script>

<form action="?/prepay" method="POST" use:enhance class="flex flex-col space-y-4 max-w-xl">
	<label class="label">
		<span class="text-sm font-bold text-surface-700 dark:text-surface-300">Bankkonto</span>
		<div class="input-group input-group-divider grid-cols-[1fr_auto] rounded-container-token">
			<input
				type="text"
				placeholder={data?.card?.card_nr ? data.card.card_nr : 'Konto saknas'}
				disabled
				title="Sparat konto"
			/>
			<div class="input-group-shim">
				{#if hasSetupPaymentMethod}
					<Fa icon={cardOptions[data.card.card_type - 1].icon} scale={1.5} />
				{:else}
					<a href="/me/account/payment"><Fa scale={1.5} icon={faPlusCircle} /></a>
				{/if}
			</div>
		</div>
	</label>

	<label class="label">
		<span class="text-sm font-bold text-surface-700 dark:text-surface-300">Belopp</span>
		<input
			class="input"
			title="Input (belopp)"
			type="number"
			placeholder="Ange belopp"
			name="amount"
			disabled={!hasSetupPaymentMethod}
		/>
		<p class="text-error-400 text-xs">&nbsp; {amountError || ''}</p>
	</label>
	<button
		class="max-w-fit self-end btn variant-filled-primary text-surface-50 dark:text-primary-100"
		disabled={!hasSetupPaymentMethod}
		title="Överför"
		type="submit">Överför</button
	>
</form>
