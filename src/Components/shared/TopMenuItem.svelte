<script lang="ts">
	import { screenInfo } from './ScreenInfoStore';
	export let uri = '/';
	export let text = 'Link';
</script>

<a href={`${uri}`} class="menu-item">
	<span>{text}</span>
</a>
