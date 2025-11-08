<script>
    let { children } = $props();
</script>



<div class="line">
    <hr />
    <span>{@render children?.()}</span>
</div>


<style>
    .line {
        position: relative;
        display: flex;
        align-items: center;
        margin: 1rem 0;
        width: 100%;
        z-index: 1;
        background: var(--background);
        box-shadow: 0 4px 24px 0 rgba(0,0,0,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.12);
        filter: drop-shadow(0 0 8px rgba(0,0,0,0.10));
        border: 1px solid var(--grey);
    }

    hr {
        flex: 1;
        border: none;
        border-top: 1px solid var(--grey);
        margin: 0 1rem;
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        z-index: 0;
    }

    span {
        white-space: nowrap;
        background: var(--background);
        padding: 0 0.5rem;
        z-index: 1;
        margin-left: 2.5rem;
    }
</style>