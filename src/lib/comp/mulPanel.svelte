<script>
    let { children } = $props();

</script>


<div class="panels">
  {@render children?.()}
</div>


<style>
.panels {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

@media (max-width: 798px) {
  .panels {
    flex-direction: column;
  }
}

</style>