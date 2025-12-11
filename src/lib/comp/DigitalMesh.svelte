<script>
  import { onMount } from 'svelte';

  let canvas;
  let ctx;
  let width;
  let height;
  let animationId;

  // Variables to store tilt position (-1 to 1)
  let tiltX = 0;
  let tiltY = 0;

  const dotSizeMax = 3;
  const gridSize = 15;
  
  // Parallax configuration
  const movementStrength = 15; // Max pixels the grid moves
  const gradientSpeed = 0.5;   // How much the light pattern shifts relative to tilt

  const draw = () => {
    if (!ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    // Calculate the required extension to cover the screen plus the max parallax movement.
    // We add an extra gridSize buffer for smoother transitions.
    const extension = movementStrength + gridSize; 
    
    // Calculate columns and rows needed for the extended area
    const cols = Math.ceil((width + 2 * extension) / gridSize); 
    const rows = Math.ceil((height + 2 * extension) / gridSize); 

    // Calculate dynamic color based on tilt (-1 to 1)
    // Red and Blue channels shift based on inclination for a neon effect
    const r = Math.floor(180 + (tiltX * 75));
    const b = Math.floor(180 + (tiltY * 75));
    const g = 180; 
    
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        // Calculate base position, starting from a negative offset (extension) 
        // to draw dots that are initially off-screen.
        let centerX = i * gridSize + gridSize / 2 - extension; 
        let centerY = j * gridSize + gridSize / 2 - extension; 

        // Apply Parallax: Move the physical dots based on tilt
        centerX += tiltX * movementStrength;
        centerY += tiltY * movementStrength;
        
        // Normalized coordinates relative to the extended grid for the gradient effect
        const xNorm = i / cols; 
        const yNorm = j / rows; 

        // Dynamic Lighting: Shift the gradient calculation based on tilt
        let intensity = Math.abs((xNorm - tiltX * gradientSpeed) - (yNorm - tiltY * gradientSpeed));

        const radius = intensity * dotSizeMax;
        
        if (radius > 0.1) { 
            // Apply the dynamic color and calculated intensity/opacity
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
  };

  const handleOrientation = (e) => {
    // Limits the tilt effect to ~25 degrees
    const maxTilt = 25; 
    
    // gamma: left-to-right tilt in degrees
    // beta: front-to-back tilt in degrees
    let x = e.gamma || 0;
    let y = e.beta || 0;

    // Clamp values
    if (x > maxTilt) x = maxTilt;
    if (x < -maxTilt) x = -maxTilt;
    if (y > maxTilt) y = maxTilt;
    if (y < -maxTilt) y = -maxTilt;

    // Normalize to -1 to 1 range
    tiltX = x / maxTilt;
    tiltY = y / maxTilt;
  };

  const loop = () => {
    draw();
    animationId = requestAnimationFrame(loop);
  };

  onMount(() => {
    ctx = canvas.getContext('2d', { alpha: false });
    resize();
    
    // Start the animation loop
    loop();

    window.addEventListener('resize', resize);
    // Only listen for device orientation (phone tilt)
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('deviceorientation', handleOrientation);
      cancelAnimationFrame(animationId);
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