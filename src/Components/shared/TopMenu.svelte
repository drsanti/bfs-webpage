<script lang="ts">
	import { screenInfo } from './ScreenInfoStore';
	import TopMenuItem from './TopMenuItem.svelte';
</script>

{#if $screenInfo.isSmallScreen === false}
	<div class="flex flex-row flex-grow items-center justify-end space-x-4 pr-4">
		<TopMenuItem uri={'trainings'} text={'trainings'} />
		<TopMenuItem uri={'services'} text={'services'} />
		<TopMenuItem uri={'about'} text={'about'} />
	</div>
{/if}
