<script>
  import { onMount } from 'svelte';

  let canvas;
  let ctx;
  let width;
  let height;

  const dotSizeMax = 3;
  const gridSize = 15;

  // --- Parallax offset ---
  let offsetX = 0;
  let offsetY = 0;
  let tiltX = 0;
  let tiltY = 0;

  // Smoothing factor
  const smooth = 0.1;

  const draw = () => {
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const cols = Math.floor(width / gridSize);
    const rows = Math.floor(height / gridSize);

    // --- Smooth interpolation ---
    offsetX += (tiltX - offsetX) * smooth;
    offsetY += (tiltY - offsetY) * smooth;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Apply parallax offset here:
        const centerX = i * gridSize + gridSize / 2 + offsetX;
        const centerY = j * gridSize + gridSize / 2 + offsetY;

        const xNorm = i / cols;
        const yNorm = j / rows;

        let intensity = Math.abs(xNorm - yNorm);
        const radius = intensity * dotSizeMax;

        if (radius > 0.1) {
          ctx.fillStyle = `rgba(195, 195, 195, ${intensity * 0.9})`;

          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    requestAnimationFrame(draw);
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  };

  // Handle phone tilt
  const handleTilt = (e) => {
    tiltX = (e.gamma || 0) * 1.5; // left/right
    tiltY = (e.beta || 0) * 1.5;  // forward/back
  };

  onMount(() => {
    ctx = canvas.getContext('2d', { alpha: false });
    resize();
    window.addEventListener('resize', resize);

    // orientation
    window.addEventListener('deviceorientation', handleTilt);

    requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('deviceorientation', handleTilt);
    };
  });
</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background-color: #000000;
    pointer-events: none;
  }
</style>
