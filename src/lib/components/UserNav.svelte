<script lang="ts">
	import { enhance } from '$app/forms';
	import Fa from 'svelte-fa';
	import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
	import {
		faCog,
		faCreditCard,
		faRoute,
		faWallet,
		faMoneyBillTransfer
	} from '@fortawesome/free-solid-svg-icons';

	export const accountLinksWithIcons = [
		{ name: 'Inställningar', path: '/me/account/settings', icon: faCog },
		{ name: 'Kortuppgifter', path: '/me/account/payment', icon: faCreditCard },
		{ name: 'Prepay', path: '/me/account/prepay', icon: faMoneyBillTransfer },
		{ name: 'Betalningar', path: '/me/account/transactions', icon: faWallet },
		{ name: 'Resehistorik', path: '/me/account/trips', icon: faRoute }
	];
</script>

<div aria-label="navigation" class="overflow-auto h-full">
	<div class="rounded-container-token border dark:border-surface-800">
		<ul class="font-medium">
			{#each accountLinksWithIcons as link}
				<li>
					<a
						href={link.path}
						class="flex w-full px-4 items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-surface-800 dark:hover:text-white"
					>
						<Fa icon={link.icon} />
						<span class="ms-4 py-4 border-b w-full dark:border-surface-800">{link.name}</span>
					</a>
				</li>
			{/each}
		</ul>
		<form action="/logout" method="POST" class="font-medium" use:enhance>
			<button
				type="submit"
				class="flex w-full px-4 py-4 items-center text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-surface-800 dark:hover:text-white"
			>
				<Fa icon={faSignOutAlt} />
				<span class="ms-4">Logga ut</span>
			</button>
		</form>
	</div>
</div>
