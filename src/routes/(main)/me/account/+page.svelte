<script lang="ts">
	import { page } from '$app/stores';
	import { Avatar } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import Fa from 'svelte-fa';
	import UserNav from '$lib/components/UserNav.svelte';
	import { cardOptions } from '$lib/utils/cardOptions';

	export let data: PageData;
</script>

<div class="space-y-4">
	<div class="flex space-x-4 items-center">
		<Avatar background="bg-gray-200 dark:bg-surface-800" initials={$page.data.user.email[0]} />
		<div>
			<p class="text-2xl text-surface-700 dark:text-surface-300 capitalize">
				{$page.data.user.email.split('@')[0]}
			</p>
			<p class="text-surface-500">{$page.data.user.email}</p>
		</div>
	</div>
	{#if data?.card !== undefined}
		<div class="flex flex-col-reverse xs:flex-row gap-4">
			<a
				href="/me/account/payment"
				class="p-2 card card-hover h-44 w-full sm:w-52 border-2 border-primary-500 dark:border-tertiary-700 grid grid-cols-3 grid-rows-3 rounded-container-token bg-gradient-to-br from-primary-500 via-tertiary-300 to-secondary-400 dark:from-tertiary-800 dark:via-tertiary-900 dark:to-primary-800"
			>
				<div
					class="text-3xl col-start-3 row-start-1 justify-self-end text-white dark:text-primary-200"
				>
					<Fa icon={cardOptions[data.card.card_type - 1].icon} />
				</div>
				<p
					class="text-white dark:text-primary-200 text-center text-base text-shadow text-shadow-sm shadow-primary-900 col-span-3 row-start-3"
				>
					{data.card.card_nr
						? `${data.card.card_nr.substring(0, 4)} XXXX XXXX XXXX`
						: 'Kortnummer saknas'}
				</p>
			</a>
			<a
				href="/me/account/prepay"
				class="card card-hover h-28 variant-soft-success grow rounded-container-token flex items-center justify-center p-4 text-center text-surface-700 dark:text-surface-300 text-2xl font-bold"
			>
				<p class="text-success-900 dark:text-success-700 font-extrabold">
					<span class="text-4xl">500</span><span class="text-2lg">,67</span><span
						class="ml-2 text-4xl text-success-400 dark:text-success-900">kr</span
					>
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
</div>
