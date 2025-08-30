import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-node';
import sveltePreprocess from 'svelte-preprocess';
import relativeImages from 'mdsvex-relative-images';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: [sveltePreprocess(), mdsvex({
		extension: '.svx',
		remarkPlugins: [relativeImages],
	})],
	kit: { adapter: adapter(), },
	extensions: ['.svelte', '.svx','.md'],
	paths: {
			relative: false,
		},
};

export default config;
