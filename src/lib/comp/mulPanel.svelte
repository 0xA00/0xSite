<script>
  let { children, direction = "row" } = $props();
</script>


<div class="panels" class:vertical={direction === "column"}>
  {@render children?.()}
</div>


<style>
.panels {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  height: 100%;
  align-items: stretch;
}


.panels.vertical {
  flex-direction: column;
}

@media (max-width: 798px) {
  .panels {
    flex-direction: column;
    gap: 0.5rem;

  }
}
</style>