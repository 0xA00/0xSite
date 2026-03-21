<script>
    export let posts = [];
</script>


<h2>Recent Posts</h2>
	<ul>
		{#each posts as post}
			<li>
				<a href={`/${post.slug}`} class="post-row">
					<span class="post-title">{post.title}</span>
					<span class="post-meta">{post.date}</span>
				</a>
			</li>
		{/each}
	</ul>


<style>
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

.post-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 1rem;
		padding: 0.75rem 0;
		text-decoration: none;
		transition: padding-left 0.2s ease-out;
	}

	.post-row:hover {
		padding-left: 0.5rem;
	}

	.post-title {
		color: var(--accent);
		font-size: 0.875rem;
		letter-spacing: 0.02em;
		transition: color 0.2s ease-out;
	}

	.post-row:hover .post-title {
		color: #ffffff;
	}

	.post-meta {
		color: var(--secondary);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		white-space: nowrap;
		flex-shrink: 0;
	}
</style>
