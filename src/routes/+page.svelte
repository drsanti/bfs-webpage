<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { BfsLooper, type LooperParams } from '../BfsThreeD/BfsLooper';
	import BlocksShuffle_3 from '../Components/shared/svg-icons/blocks-shuffle-3.svelte';
	import { BfsCanvas } from '../BfsThreeD/BfsCanvas';
	import { BfsLogo } from '../BfsThreeD/BfsLogo';
	import {
		BfsGLTFLoader,
		type ModelData,
		type ModelDownloadInfo
	} from '../BfsThreeD/Loaders/BfsGLTFLoader';
	import {
		BfsTextureLoader,
		type CubeTextureDownloadInfo
	} from '../BfsThreeD/Loaders/BfsTextureLoader';
	let params: LooperParams;
	let looper: BfsLooper;
	onMount(() => {
		new BfsLogo(document.getElementById('container')).showGrids(true);

		BfsLooper.getInstance()
			.on('frame-10', (e: LooperParams) => {
				params = e;
			})
			.start();

		// deploy >>> bfs-webpage/cube1.glb
		// BfsGLTFLoader.getInstance().loadGLTF('cube1.glb', {
		// 	onProgress: (info: ModelDownloadInfo) => {
		// 		console.log(info.percent.toFixed(2));
		// 	},
		// 	onLoaded: (data: ModelData) => {
		// 		console.log(data.glTF.scenes);
		// 	}
		// });

		BfsTextureLoader.getInstance().loadDefaultCubeEnvTexture('bridge', {
			onProgress: (info: CubeTextureDownloadInfo) => {
				console.log(info);
			},
			onDownloaded: (cubeText: THREE.CubeTexture) => {
				console.log(cubeText);
			}
		});
	});
	onDestroy(() => {
		looper?.dispose();
	});
</script>

<div class="flex justify-center relative">
	<div class=" absolute bg-black/70 w-full h-full z-10">
		<div class="flex justify-center items-center h-full border">
			<button>Lick</button>
		</div>
	</div>

	<div id="container" class="absolute w-64 h-64" />
</div>

<div>
	<div class="card card-hover m-2 variant-glass-tertiary pb-1">
		<div class="card-header flex flex-row space-x-3 text-xl">
			<BlocksShuffle_3 />
			<span>{params?.deltaTime.toFixed(2)}</span>
			<span>{(1 / params?.deltaTime).toFixed(2)}</span>
			<span>{params?.frameCount}</span>
		</div>
	</div>
</div>
