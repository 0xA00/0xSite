<script lang="ts">
	import "../app.css";
	import favicon from '$lib/assets/favicon.ico';
	import Title from "$lib/comp/Title.svelte";
	import Line from "$lib/comp/Line.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>


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
		text-align: center;
		padding: 1rem;
		font-size: 0.9rem;
		color: #888;
	}
	.layout {
		min-height: 98vh;
		display: flex;
		flex-direction: column;
	}

	.footer {
		margin-top: auto;
	}
</style>
