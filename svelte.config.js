
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	vitePlugin: {
		inspector: true,
	},
	kit: {
		adapter: adapter({
			pages: 'docs',		/* Page output directory  */
			assets: 'docs',		/* Asset output directory */
			fallback: undefined,
			precompress: false,
			strict: true,
			hash: false,
			static:{
				hash: false,
			}
		})
	},

};
export default config;