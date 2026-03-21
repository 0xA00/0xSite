<script lang="ts">
	import "../app.css";
	import favicon from '$lib/assets/favicon.ico';
	import Navbar from "$lib/comp/Navbars.svelte";
	let { children } = $props();
</script>

	<svelte:head>
		<title>0xA0.dev</title>
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="description" content="0xA0.dev personal's canvas of expression." />
		<meta name="keywords" content="0xA0, developer, portfolio, projects, blog, contact" />
		<meta name="author" content="0xA0" />
		<link rel="icon" href={favicon} />
		<meta property="og:type" content="website" />
 		<meta property="og:url" content="https://0xa0.dev/" />
  		<meta property="og:title" content="0xA0.dev" />
		<meta property="og:image" content="https://0xa0.dev/head.png" />
		<meta property="og:description" content="0xA0.dev personal's canvas of expression." />
		<meta property="twitter:card" content="summary_large_image" />
		<meta property="twitter:url" content="https://0xa0.dev/" />
		<meta property="twitter:title" content="0xA0.dev" />
		<meta property="twitter:image" content="https://0xa0.dev/head.png" />
		<meta property="twitter:description" content="0xA0.dev personal's canvas of expression." />
		<meta name="theme-color" content="#121212" />
	</svelte:head>

	<div class="layout">
		<Navbar />
		<div class="content">
		{@render children?.()}
		</div>

		<div class="footer">
			<p>&copy; {new Date().getFullYear()} 0xa0.dev. All rights reserved.</p>
		</div>

	</div>
<style>

	.footer {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: auto;
		padding-top: 1.5rem;
		padding-bottom: 1.5rem;
		width: 100%;
		text-align: center;
	}

	.layout {
		min-height: 98vh;
		display: flex;
		flex-direction: column;
	}

	.footer > p {
		font-size: 0.7rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #3a3a3a;
		margin: 0;
	}

	:global(.layout > :nth-child(2)) {
		margin-top: 2rem;
	}

	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 0 1rem;
		max-width: 560px;
		width: 100%;
		margin-left: auto;
		margin-right: auto;
		background-color: #0a0a0a;
		border: 1px solid #2a2a2a;
	}

</style>
