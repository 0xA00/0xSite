<script>
	import { page } from '$app/state';
    import GoL from '$lib/comp/GoL.svelte';





</script>

<div class="error-page">
  <GoL />
  <div class="error-info">
    <h1>{ page.status }</h1>
  </div>
</div>

<style>
.error-page {
    width: 100%;
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2rem 0;
}

.error-info {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    font-family: 'Courier New', Courier, monospace;
    text-shadow: 2px 2px 0 #000, 4px 4px 0 #222;
    image-rendering: pixelated;
    letter-spacing: 0.1em;
    text-align: center;
}

.error-info > h1 {
    font-size: clamp(2rem, 8vw, 6rem);
}





.error-page {
    position: relative;
}
</style>