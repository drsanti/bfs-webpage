<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Logo from './Logo.svelte';
	import { screenInfo } from './ScreenInfoStore';
	import PopupMenu from './PopupMenu.svelte';
	import TopMenu from './TopMenu.svelte';

	const SMALL_SIZE_THRESHOLD = 600;

	onMount(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
	});

	onDestroy(() => {
		window.removeEventListener('resize', handleResize);
	});

	/**
	 * Update screen dimension and flags
	 */
	const handleResize = () => {
		const isMobile = /mobile|android|iphone|ipad|iemobile/.test(
			navigator.userAgent.toLowerCase()
		);
		const isSmallScreen = isMobile || window.innerWidth < SMALL_SIZE_THRESHOLD;

		screenInfo.update((info) => {
			return {
				...info,
				isMobile,
				isSmallScreen,
				innerWidth: window.innerWidth,
				innerHeight: window.innerHeight
			};
		});
	};
</script>

<div class="flex flex-row bg-black/50 p-2">
	<Logo />
	<TopMenu />
	<PopupMenu />
</div>
