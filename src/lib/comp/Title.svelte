<script>
	import { onMount } from "svelte";
	import Logo42 from "./Logo42.svelte";

    let latency = $state(null)
    let viewportWidth = $state(0)
    let viewportHeight = $state(0)

    function updateViewport() {
        viewportWidth = window.innerWidth
        viewportHeight = window.innerHeight
    }

    async function measurePing() {
        const start = performance.now()

        try {
            await fetch('https://www.google.com/generate_204', {
                method: 'GET',
                mode: 'no-cors',
                cache: 'no-cache',
            })
            latency = Math.round(performance.now() - start)
        } catch (error) {
            latency = null
        }
    }


    onMount(() => {
        measurePing()
        updateViewport()
        window.addEventListener("resize", updateViewport)
    })
</script>



<div class="panel">
    <div class="panel-label">0xA0.dev</div>
    <div class="title">
        <p>Latency: {latency ? latency + " ms" : "?"}</p>
        <p>Viewport: {viewportWidth ? viewportWidth + "x" + viewportHeight : "? x ?"}</p>
    </div>
    <Logo42 />
</div>

<style>
    .panel {
    width: fit-content;
    min-width: 260px;
    max-width: 100vw;
    box-sizing: border-box;
    overflow-wrap: break-word;
    background: var(--background);
    box-shadow: 0 4px 24px 0 rgba(0,0,0,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.12);
    filter: drop-shadow(0 0 8px rgba(0,0,0,0.10));
    display: flex;
    flex-direction: row;
    gap: 1rem;
}


</style>