<script>
  import { onMount } from 'svelte';

  let canvas;
  let ctx;
  let width;
  let height;

  // State for device orientation
  let tiltX = 0; // Gamma: Left/Right tilt
  let tiltY = 0; // Beta: Front/Back tilt

  const dotSizeMax = 3;
  const gridSize = 15;
  
  const draw = () => {
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    const cols = Math.floor(width / gridSize);
    const rows = Math.floor(height / gridSize);
    
    // Calculate parallax offset based on tilt
    // Multiplier determines how much the grid moves
    const offsetX = tiltX * 2; 
    const offsetY = tiltY * 2;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Apply offset to center position
        const centerX = i * gridSize + gridSize / 2 + offsetX;
        const centerY = j * gridSize + gridSize / 2 + offsetY;
        
        const xNorm = i / cols; 
        const yNorm = j / rows; 

        let intensity =  Math.abs(xNorm - yNorm);

        const radius = intensity * dotSizeMax;
        
        if (radius > 0.1) { 
            // Base color
            let r = 195;
            let g = 195;
            let b = 195;

            // If there is significant tilt, shift the color
            // tiltX/Y are roughly in range -45 to 45 for normal viewing
            if (Math.abs(tiltX) > 1 || Math.abs(tiltY) > 1) {
                r = Math.min(255, Math.max(0, 195 + tiltX * 2));
                g = Math.min(255, Math.max(0, 195 + tiltY * 2));
                b = 200; // Keep blue relatively constant or vary it differently
            }

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${intensity * 0.9})`; 
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
        }
      }
    }
  };

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    draw();
  };

  const handleOrientation = (event) => {
    // Gamma is the left-to-right tilt in degrees, where right is positive
    // Beta is the front-to-back tilt in degrees, where front is positive
    // We clamp values to avoid extreme shifts
    const maxTilt = 30;
    
    let gamma = event.gamma || 0; 
    let beta = event.beta || 0;

    // Clamp values
    if (gamma > maxTilt) gamma = maxTilt;
    if (gamma < -maxTilt) gamma = -maxTilt;
    if (beta > maxTilt) beta = maxTilt;
    if (beta < -maxTilt) beta = -maxTilt;

    tiltX = gamma;
    tiltY = beta;

    requestAnimationFrame(draw);
  };

  onMount(() => {
    ctx = canvas.getContext('2d', { alpha: false });
    resize();
    window.addEventListener('resize', resize);
    
    // Check if device orientation is supported
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (window.DeviceOrientationEvent) {
          window.removeEventListener('deviceorientation', handleOrientation);
      }
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