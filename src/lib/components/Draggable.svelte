<script lang="ts">
	import { onMount } from 'svelte';

	/**
	 * The initial left position of the draggable
	 * @type {number}
	 */
	export let initialLeft: number | undefined;

	/**
	 * The initial top position of the draggable
	 * @type {number}
	 */
	export let initialTop: number | undefined;

	let left: number = initialLeft ?? 0;
	let top: number = initialTop ?? 0;

	/**
	 * The z-index of the draggable
	 * default: 'z-1'
	 * @type {string}
	 */
	export let zIndex: string = 'z-1';

	/**
	 * The height of the draggable
	 * default: 'h-fit'
	 * @type {string}
	 */
	export let height: string = 'h-fit';

	/**
	 * The width of the draggable
	 * default: 'w-full'
	 * @type {string}
	 */
	export let width: string = 'w-full';

	/**
	 * The distance from the bottom of the window that the draggable will snap to (in pixels)
	 * @type {string}
	 */
	export let snapBottom: number = 0;

	/**
	 * The distance from the top of the window that the draggable will snap to (in pixels)
	 * @type {string}
	 */
	export let snapTop: number = 0;

	/**
	 * The distance from the top of the window that the draggable will snap to (in pixels)
	 * @type {string}
	 */
	export let snapMiddle: number = 0;

	/**
	 * Arbitrary classes to add to the draggable
	 * default: ''
	 * @type {string}
	 */
	export let classes: string = '';

	/**
	 * The number of pixels that the user can drag the draggable outside the snapBottom and snapTop values
	 * default: 8
	 * @type {number}
	 */
	export let snapPadding: number = 8;

	/**
	 * It's more intuitive to think of the snapBottom value as the distance from the bottom of the window, but it's actually the distance from the top of the window.
	 * This variable is used to calculate the real snapBottom value. Which let's the user set the snapBottom value as the distance from the bottom of the window.
	 */
	let realSnapBottom: number = 0;

	// The window is not available before the component is mounted
	onMount(() => {
		realSnapBottom = window.innerHeight - snapBottom;
	});

	/**
	 * Set this to snap the draggable to a specific position
	 * @type {{ left: number; top: number }
	 */
	export let snapTo: { left: number; top: number };

	// Update the left and top values when snapTo changes
	$: if (snapTo) {
		left = snapTo.left;
		top = snapTo.top;
	}

	/**
	 * The draggable element
	 * @type {HTMLElement}
	 */
	let draggable: HTMLElement;

	/**
	 * Indicates if the draggable is currently being moved
	 * @type {boolean}
	 */
	let moving: boolean = false;

	/**
	 * The pointerId of the pointer that is currently moving the draggable
	 * Used to handle multiple pointers, e.g. touch and mouse
	 * @type {number | null}
	 */
	let capturedPointerId: number | null = null;

	function onPointerDown(e: PointerEvent) {
		draggable.setPointerCapture(e.pointerId);
		capturedPointerId = e.pointerId;
		moving = true;
	}

	/** Indicates the direction the user is moving the draggable in the y-axis
	 * 1 = down
	 * -1 = up
	 * @type {number}
	 */
	let lastYDirection: number = 0;

	function onPointerMove(e: PointerEvent) {
		if (capturedPointerId != e.pointerId) return;
		if (!moving) return;
		// calculate move direction, positive or negative
		// const xDirection = e.movementX > 0 ? 1 : -1;
		lastYDirection = e.movementY > 0 ? 1 : -1;
		// return if the pointer is outside the window
		if (draggable.getBoundingClientRect().top < 0 + snapTop - snapPadding && lastYDirection <= 0)
			return;

		if (draggable.getBoundingClientRect().top > realSnapBottom + snapPadding && lastYDirection >= 0)
			return;

		// left += e.movementX;
		top += e.movementY;
	}

	function onPointerUp(e: PointerEvent) {
		moving = false;
		capturedPointerId = null;
		draggable.releasePointerCapture(e.pointerId);

		// snap to snapBottom, middle or snapTop in the y-axis direction you're moving
		if (lastYDirection > 0) {
			if (top > snapMiddle) top = realSnapBottom;
			else top = snapMiddle;
		} else {
			if (top < snapMiddle) top = snapTop;
			else top = snapMiddle;
		}
	}
</script>

<section
	bind:this={draggable}
	on:pointerdown={onPointerDown}
	role="toolbar"
	tabindex="0"
	style:transform="translate({left}px, {top}px)"
	class="absolute {height} {width} transition-transform ease-out cursor-move select-none touch-none {zIndex} {classes}"
>
	<slot />
</section>

<svelte:window on:pointerup={onPointerUp} on:pointermove={onPointerMove} />
