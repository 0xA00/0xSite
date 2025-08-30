
<script>
    let { children, title } = $props();

</script>


<div class="panel">
  <div class="panel-label">{title}</div>
  <div class="text">{@render children?.()}</div>
</div>


<style>
.text {
    word-break: break-word;
}

.panel {
    margin-bottom: 1.5rem;
    height: auto;
    width: fit-content;
}
</style>
