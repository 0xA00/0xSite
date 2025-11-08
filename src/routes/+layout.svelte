<script lang="ts">
	import "../app.css";
	import favicon from '$lib/assets/favicon.ico';
	import Title from "$lib/comp/Title.svelte";
	import Line from "$lib/comp/Line.svelte";
	import Animbackground from "$lib/comp/animbackground.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
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
