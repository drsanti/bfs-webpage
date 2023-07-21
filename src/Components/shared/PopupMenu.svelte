<script lang="ts">
	//
	import { Drawer, drawerStore } from '@skeletonlabs/skeleton';
	import PopupMenuItem from './PopupMenuItem.svelte';
	import { screenInfo } from './ScreenInfoStore';

	//
	let showing = false;
	const hamburgerClickHandle = () => {
		showing == false ? drawerStore.open() : drawerStore.close();
		showing = !showing;
	};

	const close = () => {
		setTimeout(() => {
			drawerStore.close();
			showing = false;
		}, 250);
	};
</script>

{#if $screenInfo.isSmallScreen}
	<div on:mousedown={hamburgerClickHandle} class="flex flex-grow justify-end mr-4">
		<div
			class="flex flex-col space-y-2 items-end justify-center h-full cursor-pointer"
		>
			<div class="w-6 h-0.5 bg-red-200" />
			<div class="w-6 h-0.5 bg-green-200" />
			<div class="w-6 h-0.5 bg-blue-300" />
		</div>
	</div>

	<Drawer
		on:backdrop={close}
		class="mt-16 border-0 rounded-2xl"
		position={'left'}
		duration={1000}
		shadow={'none'}
		bgDrawer={'bg-black/30'}
	>
		<div class="flex flex-col h-full justify-start items-center space-y-12 pt-12">
			<PopupMenuItem text={'Trainings'} uri={'trainings'} />
			<PopupMenuItem text={'Services'} uri={'services'} />
			<PopupMenuItem text={'About'} uri={'about'} />
		</div>
	</Drawer>
{/if}
