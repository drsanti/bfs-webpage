<script lang="ts">
	import BlocksShuffle_3 from './svg-icons/blocks-shuffle-3.svelte';
	export let uri = '/';
	export let text = 'Link';
</script>

<a href={`${uri}`}>
	<div class="flex flex-col text-xl items-center">
		<BlocksShuffle_3 />
		<span>{text}</span>
	</div>
</a>
