<script lang="ts">
	import Fa from 'svelte-fa';
	import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
	import { cardOptions } from '$lib/utils/cardOptions';
	import type { Card } from '$lib/types/Card';

	export let card: Card | undefined;
</script>

{#if card !== undefined}
	<a
		href="/me/account/payment"
		class="py-4 px-4 rounded-container-token bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300 grid grid-cols-[auto,1fr,auto] gap-4 items-center"
	>
		<div class="text-2xl">
			<Fa icon={cardOptions[card.card_type - 1].icon} />
		</div>
		<div>
			<p class="text-surface-500">Ditt kort</p>
			<p>
				{card.card_type_descr} - {card.card_nr
					? `${card.card_nr.substring(0, 4)}`
					: 'Kortnummer saknas'}
			</p>
		</div>
		<div class="text-surface-500"><Fa icon={faAngleRight} /></div>
	</a>
{/if}
