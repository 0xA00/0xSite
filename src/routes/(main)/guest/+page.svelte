<script lang="ts">
	import Panel from '$lib/comp/Panel.svelte';
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let loading = $state(false);

	function formatDate(iso: string): string {
		const d = new Date(iso + 'Z');
		return d.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Guestbook — 0xA0.dev™</title>
</svelte:head>

<Panel title="Guestbook">
	<p class="intro">Leave a message! Say hi, share a thought, or drop some wisdom.</p>

	<form
		method="POST"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
	>
		<div class="form-row">
			<input
				type="text"
				name="name"
				placeholder="Your name"
				maxlength="30"
				required
				autocomplete="off"
			/>
			<input
				type="text"
				name="message"
				placeholder="Your message (280 chars max)"
				maxlength="280"
				required
				autocomplete="off"
			/>
			<button type="submit" disabled={loading}>
				{loading ? '...' : 'Sign'}
			</button>
		</div>

		{#if form?.error}
			<p class="error">{form.error}</p>
		{/if}
		{#if form?.success}
			<p class="success">Message posted!</p>
		{/if}
	</form>
</Panel>

<Panel title="Messages">
	{#if data.messages.length === 0}
		<p class="empty">No messages yet. Be the first to sign!</p>
	{:else}
		<div class="messages">
			{#each data.messages as msg (msg.id)}
				<div class="message">
					<div class="message-header">
						<span class="author">{msg.name}</span>
						<span class="date">{formatDate(msg.created_at)}</span>
					</div>
					<p class="message-body">{msg.message}</p>
				</div>
			{/each}
		</div>
	{/if}
</Panel>

<style>
	.intro {
		margin-bottom: 1rem;
		color: var(--accent);
	}

	.form-row {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	input {
		background: transparent;
		border: 1px solid var(--grey);
		color: var(--text);
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		font-family: inherit;
		outline: none;
		transition: border-color 0.2s;
	}

	input:focus {
		border-color: var(--secondary);
	}

	input[name='name'] {
		width: 140px;
		flex-shrink: 0;
	}

	input[name='message'] {
		flex: 1;
		min-width: 180px;
	}

	button {
		background: var(--primary);
		color: var(--text);
		border: none;
		padding: 0.5rem 1.25rem;
		font-family: inherit;
		font-size: 0.875rem;
		cursor: pointer;
		transition: opacity 0.2s;
	}

	button:hover:not(:disabled) {
		opacity: 0.8;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.error {
		color: var(--primary);
		margin-top: 0.5rem;
		font-size: 0.8rem;
	}

	.success {
		color: #5eead4;
		margin-top: 0.5rem;
		font-size: 0.8rem;
	}

	.messages {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.message {
		border-left: 3px solid var(--grey);
		padding: 0.5rem 0.75rem;
		transition: border-color 0.2s;
	}

	.message:hover {
		border-color: var(--secondary);
	}

	.message-header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}

	.author {
		color: var(--secondary);
		font-weight: bold;
		font-size: 0.85rem;
	}

	.date {
		color: var(--grey);
		font-size: 0.75rem;
		white-space: nowrap;
	}

	.message-body {
		font-size: 0.85rem;
		word-break: break-word;
	}

	.empty {
		color: var(--grey);
		font-style: italic;
	}
</style>