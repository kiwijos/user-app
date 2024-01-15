<script lang="ts">
	export let value: number = 50;
	export let low: number = 20;
	export let medium: number = 40;
	export let width: string = 'w-full';
	export let height: string = 'h-10';
	export let text: string = 'text-center text-xl font-extrabold text-surface-700';

	export let colorLow: string = 'bg-red-500';
	export let colorMedium: string = 'bg-yellow-500';
	export let colorOptimum: string = 'bg-green-500';

	let bgLow: string = `${colorLow}/30`;
	let bgMedium: string = `${colorMedium}/30`;
	let bgOptimum: string = `${colorOptimum}/30`;

	let color = value <= low ? colorLow : value <= medium ? colorMedium : colorOptimum;
	let bg = value <= low ? bgLow : value <= medium ? bgMedium : bgOptimum;
</script>

<div class="{width} {height} {bg} grid grid-cols-1 grid-rows-1 rounded-full">
	<div class="{color} {height}  leading-none rounded-full" style="width: {value}%"></div>
	<p class="{text}  p-1">{value}%</p>
</div>
