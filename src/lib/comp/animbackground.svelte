<script>
  export let opacity = 0.7;
  export let blurAmount = 32;
</script>

<div class="gradient-container">
  <div class="blob blob1" style="opacity: {opacity}; filter: blur({blurAmount}px)"></div>
  <div class="blob blob2" style="opacity: {opacity}; filter: blur({blurAmount}px)"></div>
  <div class="blob blob3" style="opacity: {opacity}; filter: blur({blurAmount}px)"></div>
  <div class="blob blob4" style="opacity: {opacity}; filter: blur({blurAmount}px)"></div>
</div>
<div class="noise"></div>

<style>
  :global(body) {
    background: #000;
  }

  .gradient-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
    z-index: -1;
    pointer-events: none;
  }

  .blob {
    position: absolute;
    border-radius: 50%;
    animation: float 20s ease-in-out infinite;
  }

  .blob1 {
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, #ff6b9d 0%, #c44569 100%);
    top: -10%;
    left: -5%;
    animation-delay: 0s;
    animation-duration: 25s;
  }

  .blob2 {
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, #ffa84c 0%, #ff6b35 100%);
    top: 20%;
    right: -10%;
    animation-delay: -5s;
    animation-duration: 30s;
  }

  .blob3 {
    width: 450px;
    height: 450px;
    background: radial-gradient(circle, #a8e6cf 0%, #3d84a8 100%);
    bottom: -15%;
    left: 30%;
    animation-delay: -10s;
    animation-duration: 28s;
  }

  .blob4 {
    width: 550px;
    height: 550px;
    background: radial-gradient(circle, #d4a5a5 0%, #9b59b6 100%);
    bottom: 10%;
    right: 20%;
    animation-delay: -15s;
    animation-duration: 32s;
  }

  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(50px, -80px) scale(1.1);
    }
    50% {
      transform: translate(-30px, 60px) scale(0.9);
    }
    75% {
      transform: translate(70px, 40px) scale(1.05);
    }
  }

  .noise {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: 0.15;
    z-index: -1;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }

  @media (max-width: 768px) {
    .blob {
      filter: blur(60px) !important;
    }
  }
</style>
