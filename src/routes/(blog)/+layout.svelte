<script>
	import Panel from '$lib/comp/Panel.svelte';

    	let { children } = $props();
</script>


<div class="panel">
  <div class="panel-label">Blog</div>
  <div class="panel-content">
    {@render children?.()}
  </div>

    <a href="../">Go Back</a>

</div>

<style>
.panel {

    background: var(--background);
    box-shadow: 0 4px 24px 0 rgba(0,0,0,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.12);
    filter: drop-shadow(0 0 8px rgba(0,0,0,0.10));
}
</style>

