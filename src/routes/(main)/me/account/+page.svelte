<script lang="ts">
	import { page } from '$app/stores';
	import { Avatar, LightSwitch } from '@skeletonlabs/skeleton';
	import UserNav from '$lib/components/UserNav.svelte';

	import PaymentCardButton from '$lib/components/PaymentCardButton.svelte';

	const [balance, balanceDecimals] =
		typeof $page.data?.balance === 'number'
			? $page.data.balance.toFixed(2).split('.')
			: ['0', '00'];
</script>

<div class="py-8 px-4 space-y-4">
	<div class="flex space-x-4 items-center">
		<Avatar
			background="bg-gray-200 dark:bg-surface-800"
			initials={$page.data?.user?.email ? $page.data?.user?.email[0] : 'X'}
		/>
		<div>
			<p class="text-2xl text-surface-700 dark:text-surface-300 capitalize">
				{$page.data?.user?.email ? $page.data.user.email.split('@')[0] : 'Användare'}
			</p>
			<p class="text-surface-500">{$page.data?.user?.email ?? 'epostadress'}</p>
		</div>
	</div>
	{#if $page.data?.card !== undefined}
		<div class="flex flex-col-reverse xs:flex-row gap-4">
			<PaymentCardButton card={$page.data?.card} />
			<a
				href="/me/account/prepay"
				class="card card-hover h-28 variant-soft-success grow rounded-container-token flex items-center justify-center p-4 text-center text-surface-700 dark:text-surface-300 text-2xl font-bold"
			>
				<p class="text-success-900 dark:text-success-700 font-extrabold">
					<span class="text-4xl">{balance}</span>,<span class="text-2lg">{balanceDecimals}</span
					><span class="ml-2 text-4xl text-success-400 dark:text-success-900">kr</span>
				</p>
			</a>
		</div>
	{:else}
		<a
			href="/me/account/payment"
			class="block card card-hover p-4 variant-soft-primary w-full sm:w-52 space-y-2"
		>
			<span class="badge rounded variant-filled-primary text-surface-50 dark:text-primary-100"
				>Kom igång!</span
			>
			<p class="text-sm text-blue-800 dark:text-blue-400">
				Ställ in kortuppgifter för att kunna hyra elsparkcyklar i appen.
			</p>
		</a>
	{/if}
	<UserNav />
	<div
		class="p-4 text-sm flex justify-between items-center rounded-container-token border dark:border-surface-800"
	>
		<p class="text-sm font-medium text-gray-700 dark:text-gray-200">Välj färgtema</p>
		<LightSwitch />
	</div>
</div>
