<script lang="ts">
	import "../app.css";
	import favicon from '$lib/assets/favicon.ico';
	import Title from "$lib/comp/Title.svelte";
	import Line from "$lib/comp/Line.svelte";
	import Animbackground from "$lib/comp/animbackground.svelte";
	import headsvg from '$lib/assets/head.svg';

	let { children } = $props();
</script>

	<svelte:head>
		<title>0xA0.dev™</title>
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="description" content="0xA0.dev personal's canvas of expression." />
		<meta name="keywords" content="0xA0, developer, portfolio, projects, blog, contact" />
		<meta name="author" content="0xA0" />
		<link rel="icon" href={favicon} />
		<meta property="og:type" content="website" />
 		<meta property="og:url" content="https://0xa0.dev/" />
  		<meta property="og:title" content="0xA0.dev™" />
		<meta property="og:image" content="static/head.png" />
		<meta property="og:description" content="0xA0.dev personal's canvas of expression." />
		<meta property="twitter:card" content="summary_large_image" />
		<meta property="twitter:url" content="https://0xa0.dev/" />
		<meta property="twitter:title" content="0xA0.dev™" />
		<meta property="twitter:image" content="static/head.png" />
		<meta property="twitter:description" content="0xA0.dev personal's canvas of expression." />
		<meta name="theme-color" content="#121212" />
	</svelte:head>
<Animbackground />

	<div class="layout">
		<div class="header">
			<Title />
		</div>

		<Line>
			Content
		</Line>

		{@render children?.()}

		<div class="footer">
			<Line>
				Footer
			</Line>
			<p>&copy; {new Date().getFullYear()} 0xa0.dev. All rights reserved.</p>
		</div>

	</div>







<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
	}

	.footer {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: auto;
		padding-top: 1rem;
		padding-bottom: 1rem;
		width: 100%;
		text-align: center;
	}
	.layout {
		min-height: 98vh;
		display: flex;
		flex-direction: column;
	}

	.footer > p {
		font-size: 1rem;
		text-shadow: 2px 2px 6px rgba(0,0,0,0.4), 0 0 2px #3a3a3a;
		margin-top: 0.5rem;
	}

</style>
