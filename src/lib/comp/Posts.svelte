<script>
	import FullPanel from "./FullPanel.svelte";
    export let posts = [];

</script>
<FullPanel title="Recent Posts">

	<ul>
		{#each posts as post}
			<li><a href={`/${post.slug}`}>{post.title}</a> by <span class="light">{post.author}</span> on <span class="light">{post.date}</span></li>
		{/each}
	</ul>

</FullPanel>


<style>
	.light {
		color: var(--text);
	}
	li {
		margin-bottom: 0.5rem;
		color: var(--grey);
	}
</style>
