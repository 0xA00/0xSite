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

