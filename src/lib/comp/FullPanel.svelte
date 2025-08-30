<script>
    let { children, title } = $props();

</script>


<div class="panel">
  <div class="panel-label">{title}</div>
  <div class="panel-content">{@render children?.()}</div>
</div>
