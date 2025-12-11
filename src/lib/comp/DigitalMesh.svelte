<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  let canvas: HTMLCanvasElement | null = null;
  let ctx: CanvasRenderingContext2D | null = null;
  let width = 0;
  let height = 0;

  const dotSizeMax = 3;
  const gridSize = 12;
  const bleed = 48; // pixels to bleed on each side

  // parallax controls
  const parallaxMax = 28; // max shift in CSS px
  let targetX = 0;
  let targetY = 0;
  let curX = 0;
  let curY = 0;
  const smoothing = 0.12; // lerp factor

  // UI for iOS permission
  let needsPermission = false;
  let permissionRequested = false;

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

  const draw = () => {
    if (!ctx || !canvas) return;

    const drawWidth = width + 2 * bleed;
    const drawHeight = height + 2 * bleed;

    // pad to ensure full cover when translated
    const pad = Math.ceil(parallaxMax) + 2;

    ctx.save();
    // translate by current smoothed parallax (CSS pixels)
    ctx.translate(curX, curY);

    // background fill (expand by pad to avoid edge artifacts)
    ctx.fillStyle = '#000000';
    ctx.fillRect(-pad, -pad, drawWidth + pad * 2, drawHeight + pad * 2);

    const cols = Math.floor(drawWidth / gridSize);
    const rows = Math.floor(drawHeight / gridSize);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const centerX = i * gridSize + gridSize / 2;
        const centerY = j * gridSize + gridSize / 2;

        const xNorm = i / cols;
        const yNorm = j / rows;

        let intensity = Math.abs(xNorm - yNorm);
        const radius = intensity * dotSizeMax;

        if (radius > 0.1) {
          ctx.fillStyle = `rgba(195,195,195,${intensity * 0.9})`;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.restore();
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    if (!canvas) return;

    const drawWidth = Math.floor((width + 2 * bleed) * dpr);
    const drawHeight = Math.floor((height + 2 * bleed) * dpr);

    canvas.width = drawWidth;
    canvas.height = drawHeight;

    canvas.style.width = `${width + 2 * bleed}px`;
    canvas.style.height = `${height + 2 * bleed}px`;
    canvas.style.left = `${-bleed}px`;
    canvas.style.top = `${-bleed}px`;

    if (ctx) {
      // ensure CSS-px coordinates map to canvas drawing correctly
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    draw();
  };

  // smooth animation loop to update curX/curY and redraw
  let rafId = 0;
  const loop = () => {
    // lerp current pos toward target
    curX += (targetX - curX) * smoothing;
    curY += (targetY - curY) * smoothing;

    // only redraw if movement is perceptible or periodically (cheap)
    draw();

    rafId = requestAnimationFrame(loop);
  };

  // handle device orientation (tilt)
  function handleOrientation(e: DeviceOrientationEvent) {
    // gamma: left/right [-90,90], beta: front/back [-180,180]
    const gamma = e.gamma ?? 0;
    const beta = e.beta ?? 0;

    // map a reasonable tilt range (~±30deg) to parallax range
    const gx = clamp(gamma / 30, -1, 1);
    const by = clamp(beta / 30, -1, 1);

    // invert Y so tilting forward moves content up (experimentally nicer)
    targetX = gx * parallaxMax;
    targetY = -by * parallaxMax;
  }

  // fallback: pointer move for desktop/testing
  function handlePointer(e: PointerEvent) {
    if (!width || !height) return;
    const nx = (e.clientX / width - 0.5) * 2; // -1..1
    const ny = (e.clientY / height - 0.5) * 2;
    targetX = clamp(nx, -1, 1) * parallaxMax;
    targetY = -clamp(ny, -1, 1) * parallaxMax;
  }

  // attach orientation listener; iOS requires explicit permission
  async function enableOrientation() {
    permissionRequested = true;
    needsPermission = false;
    // iOS 13+ permission API
    const devOrient: any = DeviceOrientationEvent as any;
    if (devOrient && typeof devOrient.requestPermission === 'function') {
      try {
        const res = await devOrient.requestPermission();
        if (res === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } catch {
        // ignore
      }
    } else {
      // non-iOS or older browsers
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }

  onMount(() => {
    if (!canvas) return;
    ctx = canvas.getContext('2d', { alpha: false });
    resize();
    window.addEventListener('resize', resize);

    // detect if we need permission (iOS)
    const devOrient: any = DeviceOrientationEvent as any;
    if (devOrient && typeof devOrient.requestPermission === 'function' && !permissionRequested) {
      // show a small enable button for the user to tap
      needsPermission = true;
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    // fallback pointer for desktop/testing
    window.addEventListener('pointermove', handlePointer);

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('pointermove', handlePointer);
    };
  });

</script>

<canvas bind:this={canvas}></canvas>

{#if needsPermission}
  <!-- minimal unobtrusive button to request permission on iOS -->
  <button on:click={enableOrientation} class="motion-allow">
    Enable Motion
  </button>
{/if}

<style>
  canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background-color: #000;
    pointer-events: none;
  }

  .motion-allow {
    position: fixed;
    right: 12px;
    bottom: 12px;
    z-index: 9999;
    background: rgba(255,255,255,0.06);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.08);
    padding: 8px 12px;
    border-radius: 6px;
    backdrop-filter: blur(6px);
    font-size: 13px;
  }
</style>