<script lang="ts">
    import { onMount } from 'svelte';

    export let random: number = 0.5;

    let canvas: HTMLCanvasElement;
    let width: number;
    let rows: number;
    const cellSize = 5;
    let grid: number[][] = [];

    function createGrid() {
        return Array.from({ length: rows }, () =>
            Array.from({ length: width }, () => Math.random() > random ? 1 : 0)
        );
    }

    function nextGen(grid: number[][]) {
        const newGrid = grid.map(arr => [...arr]);
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < width; x++) {
                let neighbors = 0;
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const ny = y + dy;
                        const nx = x + dx;
                        if (ny >= 0 && ny < rows && nx >= 0 && nx < width) {
                            neighbors += grid[ny][nx];
                        }
                    }
                }
                if (grid[y][x] === 1) {
                    newGrid[y][x] = neighbors === 2 || neighbors === 3 ? 1 : 0;
                } else {
                    newGrid[y][x] = neighbors === 3 ? 1 : 0;
                }
            }
        }
        return newGrid;
    }

    function draw(ctx: CanvasRenderingContext2D, grid: number[][]) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < width; x++) {
                if (grid[y][x]) {
                    ctx.fillStyle = '#444';
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
    }

    function handleClick(event: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / cellSize);
        const y = Math.floor((event.clientY - rect.top) / cellSize);
        if (y >= 0 && y < rows && x >= 0 && x < width) {
            grid[y][x] = 1;
        }
    }

    onMount(() => {
        const parent = canvas.parentElement;
        if (parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }
        width = Math.floor(canvas.width / cellSize);
        rows = Math.floor(canvas.height / cellSize);

        grid = createGrid();
        const ctx = canvas.getContext('2d');
        function loop() {
            // sleep 100ms
            const start = performance.now();
            while (performance.now() - start < 50) {}
            grid = nextGen(grid);
            if (ctx) draw(ctx, grid);
            requestAnimationFrame(loop);
        }
        if (ctx) draw(ctx, grid);
        loop();
    });
</script>

<style>
    .responsive-canvas {
        width: 100%;
        height: 100%;
        display: block;
        border: 2px solid var(--grey);
    }
</style>

<canvas
    bind:this={canvas}
    class="responsive-canvas"
    on:click={handleClick}
></canvas>
