<script lang="ts">
	// The ordering of these imports is critical to your app working properly
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import '../app.postcss';
	import MainMenu from '../Components/shared/MainMenu.svelte';
</script>

<svelte:head>
	<title>bits-fusion</title>
</svelte:head>
<MainMenu />
<slot />
