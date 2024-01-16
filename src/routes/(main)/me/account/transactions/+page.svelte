<script lang="ts">
	import type { PageData } from './$types';
	import Fa from 'svelte-fa';
	import { faAngleRight, faXmark } from '@fortawesome/free-solid-svg-icons';
	import { formatDateReadable } from '$lib/services/dateFormatter';
	import type { Transaction } from '$lib/types/Transaction';
	import type { TransactionFormatted } from '$lib/types/TransactionFormatted';
	import TabSwitcher from '$lib/components/TabSwitcher.svelte';
	import TabButton from '$lib/components/TabButton.svelte';
	import VerticalTable from '$lib/components/VerticalTable.svelte';

	let currentTab = 0;

	let selectedTransaction: TransactionFormatted | undefined;
	let selectedRows: (string | number)[][] = [];
	let headers: string[] = [];

	$: if (selectedTransaction) {
		selectedRows = [
			[
				selectedTransaction.id,
				selectedTransaction.date_formatted,
				selectedTransaction.ref,
				selectedTransaction.amount_formatted
			]
		];
		headers = ['Betalnr', 'Datum', 'Referens', 'Belopp'];
	}

	function handleTabButtonClick(
		event: CustomEvent<{ index: number }>,
		TransactionId: number | undefined
	) {
		currentTab = event.detail.index;

		if (currentTab === 1 && TransactionId !== undefined) {
			selectedTransaction = formattedTransactions.find(
				(Transaction) => Transaction.id === TransactionId
			);
		}

		if (currentTab === 0) {
			selectedTransaction = undefined;
		}
	}

	export let data: PageData;

	function categorizeTransactionsByMonthAndYear(transactions: TransactionFormatted[]) {
		const categorizedTransactions: { [key: string]: TransactionFormatted[] } = {};

		transactions.forEach((transaction) => {
			const startTime = new Date(transaction.date);
			const month = startTime.toLocaleString('default', { month: 'long' });
			const year = startTime.getFullYear();
			const category = `${month} ${year}`;

			if (!categorizedTransactions[category]) {
				categorizedTransactions[category] = [];
			}

			categorizedTransactions[category].push(transaction);
		});

		return categorizedTransactions;
	}

	const formattedTransactions: TransactionFormatted[] = data.transactions.map(
		(transaction: Transaction) => {
			const formattedDate = formatDateReadable(transaction.date);
			const formattedAmount = `${transaction.amount} kr`.replace('.', ',');

			return {
				...transaction,
				date_formatted: formattedDate,
				amount_formatted: formattedAmount
			};
		}
	);

	const categorizedTransactions = categorizeTransactionsByMonthAndYear(formattedTransactions);
</script>

<TabSwitcher {currentTab}>
	<div class="py-8 space-y-2" slot="tab1">
		{#each Object.entries(categorizedTransactions) as [dateCategory, transactions]}
			<div class="text-surface-500">
				<div class="border-b border-primary-400 dark:border-primary-900 pl-4">
					<h1 class="text-lg capitalize text-primary-400 dark:text-primary-900">
						{dateCategory}
					</h1>
				</div>
				<div class="divide-y divide-surface-300 dark:divide-surface-800">
					{#each transactions as transaction}
						<TabButton
							index={1}
							width="w-full"
							classes="flex pl-4 py-2"
							on:tabButtonClick={(e) => handleTabButtonClick(e, transaction.id)}
						>
							<div class="grow">
								<div class="text-lg text-surface-700 dark:text-surface-300 flex justify-between">
									<p>{transaction.amount_formatted}</p>
									<p>Ref#{transaction.ref}</p>
								</div>
								<div class="text-surface-500">
									<p>{transaction.date_formatted}</p>
								</div>
								<div class="text-surface-500 flex justify-between">
									<p>Privat</p>
									<p>Betalnr {transaction.id}</p>
								</div>
							</div>
							<div class="h-full my-auto pl-2">
								<span class="block text-surface-500 p-4"><Fa icon={faAngleRight} /></span>
							</div>
						</TabButton>
					{/each}
				</div>
			</div>
		{/each}
	</div>
	<div class="space-y-4" slot="tab2">
		<VerticalTable rows={selectedRows} {headers} />
		<TabButton
			index={0}
			classes="btn variant-soft-surface text-lg ml-2"
			on:tabButtonClick={(e) => handleTabButtonClick(e, selectedTransaction?.id)}
			><span><Fa icon={faXmark} /></span><span>Visa alla</span></TabButton
		>
	</div>
</TabSwitcher>
