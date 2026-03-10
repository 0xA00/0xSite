<script>
    import { onMount } from 'svelte';
    const USERNAME   = '0xa00';
    const TOKEN      = import.meta.env.VITE_GITHUB_TOKEN ?? '';

    let weeks        = [];
    let total        = 0;
    let topLangs     = [];
    let loading      = true;
    let error        = null;
    let tooltip      = null;
    let mounted      = false;

    const LANG_COLORS = {
        'C':          '#555555',
        'C++':        '#f34b7d',
        'Python':     '#3572A5',
        'JavaScript': '#f1e05a',
        'TypeScript': '#3178c6',
        'Shell':      '#89e051',
        'Makefile':   '#427819',
        'HTML':       '#e34c26',
        'CSS':        '#563d7c',
        'Svelte':     '#ff3e00',
        'Rust':       '#dea584',
        'Go':         '#00ADD8',
        'Java':       '#b07219',
        'Lua':        '#000080',
    };

    const QUERY = `
        query($login: String!) {
            user(login: $login) {
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                        weeks {
                            contributionDays {
                                date
                                contributionCount
                                color
                            }
                        }
                    }
                }
            }
        }
    `;

    onMount(async () => {
        if (!TOKEN) {
            error = 'No VITE_GITHUB_TOKEN found. Add it to your .env file.';
            loading = false;
            return;
        }
        try {
            const res = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TOKEN}`,
                },
                body: JSON.stringify({ query: QUERY, variables: { login: USERNAME } }),
            });
            const json = await res.json();
            if (json.errors) throw new Error(json.errors[0].message);
            const cal = json.data.user.contributionsCollection.contributionCalendar;
            weeks = cal.weeks;
            total = cal.totalContributions;

            const reposRes = await fetch(`https://api.github.com/user/repos?per_page=100&affiliation=owner`, {
                headers: { 'Authorization': `Bearer ${TOKEN}` },
            });
            const repos = await reposRes.json();
            const langResults = await Promise.all(
                repos.map(r =>
                    fetch(`https://api.github.com/repos/${USERNAME}/${r.name}/languages`, {
                        headers: { 'Authorization': `Bearer ${TOKEN}` },
                    }).then(r => r.json()).catch(() => ({}))
                )
            );
            const langTotals = {};
            langResults.forEach(langs => {
                Object.entries(langs).forEach(([lang, bytes]) => {
                    langTotals[lang] = (langTotals[lang] ?? 0) + bytes;
                });
            });
            const totalBytes = Object.values(langTotals).reduce((a, b) => a + b, 0);
            topLangs = Object.entries(langTotals)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([name, bytes]) => ({
                    name,
                    pct:   Math.round((bytes / totalBytes) * 100),
                    color: LANG_COLORS[name] ?? '#666',
                }));
        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
            requestAnimationFrame(() => { mounted = true; });
        }
    });

    function showTooltip(e, day) {
        const rect = e.target.getBoundingClientRect();
        const parent = e.target.closest('.heatmap-scroll').getBoundingClientRect();
        tooltip = {
            x: rect.left - parent.left + rect.width / 2,
            y: rect.top  - parent.top  - 8,
            text: `${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''} on ${day.date}`,
        };
    }

    function hideTooltip() { tooltip = null; }

    function levelColor(count) {
        if (count === 0)  return 'var(--c0)';
        if (count  < 3)   return 'var(--c1)';
        if (count  < 6)   return 'var(--c2)';
        if (count  < 10)  return 'var(--c3)';
        return 'var(--c4)';
    }

    function glowColor(count) {
        if (count === 0)  return 'transparent';
        if (count  < 3)   return 'rgba(78, 201, 176, 0.15)';
        if (count  < 6)   return 'rgba(78, 201, 176, 0.25)';
        if (count  < 10)  return 'rgba(78, 201, 176, 0.4)';
        return 'rgba(78, 201, 176, 0.6)';
    }

    $: currentStreak = (() => {
        let streak = 0;
        const allDays = weeks.flatMap(w => w.contributionDays).reverse();
        const startIdx = allDays.length > 0 && allDays[0].contributionCount === 0 ? 1 : 0;
        for (let i = startIdx; i < allDays.length; i++) {
            if (allDays[i].contributionCount > 0) streak++;
            else break;
        }
        return streak;
    })();

    $: maxDay = (() => {
        let max = 0;
        weeks.forEach(w => w.contributionDays.forEach(d => { if (d.contributionCount > max) max = d.contributionCount; }));
        return max;
    })();

    const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

    $: monthLabels = (() => {
        const out = [];
        weeks.forEach((w, wi) => {
            const firstDay = w.contributionDays[0];
            if (!firstDay) return;
            const d = new Date(firstDay.date);
            if (d.getDate() <= 7) {
                out.push({ wi, label: d.toLocaleString('en', { month: 'short' }) });
            }
        });
        return out;
    })();
</script>

<div class="heatmap-panel">
    <div class="panel-label">GitHub Activity</div>

    {#if loading}
        <div class="state-msg">
            <span class="blink">█</span> fetching contributions…
        </div>

    {:else if error}
        <div class="state-msg error">✕ {error}</div>

    {:else}
        <div class="stats-row">
            <div class="stat-block">
                <span class="stat-num">{total}</span>
                <span class="stat-label">contributions</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-block">
                <span class="stat-num streak">{currentStreak}</span>
                <span class="stat-label">day streak 🔥</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-block">
                <span class="stat-num best">{maxDay}</span>
                <span class="stat-label">best day</span>
            </div>
        </div>

        <div class="heatmap-wrap">
            <div class="day-labels">
                {#each DAY_LABELS as label}
                    <span>{label}</span>
                {/each}
            </div>

            <div class="heatmap-scroll" style="position:relative">
                <div class="month-labels">
                    {#each monthLabels as { wi, label }}
                        <span style="grid-column: {wi + 1}">{label}</span>
                    {/each}
                </div>

                <div class="grid" class:revealed={mounted}>
                    {#each weeks as week, wi}
                        <div class="week-col">
                            {#each week.contributionDays as day, di}
                                <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                                <div
                                    class="cell"
                                    class:has-contributions={day.contributionCount > 0}
                                    style="
                                        background:{levelColor(day.contributionCount)};
                                        box-shadow: 0 0 {day.contributionCount > 6 ? '6' : '3'}px {glowColor(day.contributionCount)};
                                        --delay: {wi * 12 + di * 3}ms;
                                    "
                                    on:mouseover={(e) => showTooltip(e, day)}
                                    on:mouseleave={hideTooltip}
                                    role="img"
                                    aria-label="{day.contributionCount} on {day.date}"
                                ></div>
                            {/each}
                        </div>
                    {/each}
                </div>

                {#if tooltip}
                    <div
                        class="tooltip"
                        style="left:{tooltip.x}px; top:{tooltip.y}px"
                    >
                        <div class="tooltip-arrow"></div>
                        {tooltip.text}
                    </div>
                {/if}
            </div>
        </div>

        <div class="legend">
            <span class="legend-label">Less</span>
            {#each [0,1,2,3,4] as l}
                <div class="legend-cell" style="background:var(--c{l}); box-shadow: 0 0 4px {l > 0 ? `rgba(78, 201, 176, ${l * 0.15})` : 'transparent'};"></div>
            {/each}
            <span class="legend-label">More</span>
        </div>

        {#if topLangs.length > 0}
            <div class="lang-title">
                <span class="lang-title-slash">//</span> Top languages
            </div>
            <div class="lang-bar">
                {#each topLangs as l, i}
                    <div
                        class="lang-segment"
                        style="
                            width:{l.pct}%;
                            background: linear-gradient(180deg, {l.color}, {l.color}aa);
                            animation: lang-grow 0.6s ease-out {i * 80}ms both;
                        "
                        title="{l.name} {l.pct}%"
                    ></div>
                {/each}
            </div>
            <div class="lang-legend">
                {#each topLangs as l}
                    <div class="lang-item">
                        <span class="lang-dot" style="background:{l.color}; box-shadow: 0 0 6px {l.color}88;"></span>
                        <span class="lang-name">{l.name}</span>
                        <span class="lang-pct">{l.pct}%</span>
                    </div>
                {/each}
            </div>
        {/if}
    {/if}

    <div class="scanlines"></div>
</div>

<style>
    :root {
        --c0: #161b22;
        --c1: #0e4429;
        --c2: #006d32;
        --c3: #26a641;
        --c4: #39d353;
        --border: #2e2e2e;
        --bg:     #111111;
        --text:   #c9c9c9;
        --muted:  #555555;
        --font:   'Courier New', Courier, monospace;
    }

    .heatmap-panel {
        position: relative;
        background: var(--background);
        border: 1px solid var(--grey);
        border-radius: 2px;
        padding: 22px 18px 16px;
        font-family: var(--font);
        color: var(--text);
        overflow: visible;
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    .scanlines {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.03) 2px,
            rgba(0, 0, 0, 0.03) 4px
        );
        pointer-events: none;
        z-index: 2;
    }

    .panel-label {
        position: absolute;
        top: 0; left: 12px;
        transform: translateY(-50%);
        background: var(--background);
        padding: 0 6px;
        letter-spacing: 0.04em;
        z-index: 3;
    }

    .state-msg {
        color: var(--muted);
        padding: 12px 0;
        font-size: 12px;
    }
    .state-msg.error { color: #ce9178; }
    .blink {
        animation: blink 0.8s step-start infinite;
        color: var(--c4);
    }
    @keyframes blink { 50% { opacity: 0; } }

    .stats-row {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
        padding: 10px 12px;
        background: rgba(255,255,255,0.02);
        border: 1px solid rgba(255,255,255,0.04);
        border-radius: 3px;
    }
    .stat-block {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    .stat-num {
        font-size: 22px;
        color: var(--c4);
        letter-spacing: -0.03em;
        font-weight: bold;
        text-shadow: 0 0 12px rgba(57, 211, 83, 0.3);
    }
    .stat-num.streak {
        color: #f0883e;
        text-shadow: 0 0 12px rgba(240, 136, 62, 0.3);
    }
    .stat-num.best {
        color: var(--accent);
        text-shadow: 0 0 12px rgba(86, 156, 214, 0.3);
    }
    .stat-label {
        color: var(--muted);
        font-size: 10px;
        letter-spacing: 0.04em;
    }
    .stat-divider {
        width: 1px;
        height: 28px;
        background: var(--border);
        flex-shrink: 0;
    }

    .heatmap-wrap {
        display: flex;
        gap: 4px;
        overflow-x: auto;
        padding-bottom: 12px;
    }

    .day-labels {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding-top: 18px;
        flex-shrink: 0;
        color: var(--muted);
        font-size: 9px;
        text-align: right;
    }
    .day-labels span { height: 11px; line-height: 11px; }

    .month-labels {
        display: grid;
        grid-template-columns: repeat(53, 13px);
        gap: 2px;
        height: 16px;
        margin-bottom: 2px;
        color: var(--muted);
        font-size: 9px;
    }

    .grid {
        display: flex;
        gap: 2px;
    }
    .week-col {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    .cell {
        width: 11px;
        height: 11px;
        border-radius: 2px;
        cursor: pointer;
        transition: transform 0.15s ease, opacity 0.15s ease, box-shadow 0.2s ease;
        opacity: 0;
        transform: scale(0);
        animation: none;
    }
    .grid.revealed .cell {
        animation: cell-pop 0.3s ease-out var(--delay) both;
    }
    @keyframes cell-pop {
        0% { opacity: 0; transform: scale(0); }
        70% { transform: scale(1.15); }
        100% { opacity: 1; transform: scale(1); }
    }
    .cell:hover {
        transform: scale(1.6) !important;
        z-index: 5;
        opacity: 1 !important;
    }
    .cell.has-contributions:hover {
        box-shadow: 0 0 10px rgba(57, 211, 83, 0.6) !important;
    }

    .tooltip {
        position: absolute;
        transform: translate(-50%, -100%);
        background: #1a1a2e;
        border: 1px solid rgba(78, 201, 176, 0.3);
        color: var(--text);
        font-size: 10px;
        padding: 5px 10px;
        pointer-events: none;
        white-space: nowrap;
        z-index: 10;
        border-radius: 3px;
        backdrop-filter: blur(8px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        animation: tooltip-in 0.15s ease-out;
    }
    .tooltip-arrow {
        position: absolute;
        bottom: -4px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 6px;
        height: 6px;
        background: #1a1a2e;
        border-right: 1px solid rgba(78, 201, 176, 0.3);
        border-bottom: 1px solid rgba(78, 201, 176, 0.3);
    }
    @keyframes tooltip-in {
        from { opacity: 0; transform: translate(-50%, -90%); }
        to { opacity: 1; transform: translate(-50%, -100%); }
    }

    .legend {
        display: flex;
        align-items: center;
        gap: 3px;
        margin-top: 10px;
        justify-content: flex-end;
    }
    .legend-label { color: var(--muted); font-size: 9px; margin: 0 2px; }
    .legend-cell  {
        width: 11px;
        height: 11px;
        border-radius: 2px;
        transition: transform 0.15s ease;
    }
    .legend-cell:hover { transform: scale(1.4); }

    .lang-title {
        color: var(--accent);
        font-size: 11px;
        letter-spacing: 0.06em;
        margin: 16px 0 8px;
    }
    .lang-title-slash {
        opacity: 0.4;
    }
    .lang-bar {
        display: flex;
        height: 8px;
        border-radius: 4px;
        overflow: hidden;
        gap: 2px;
        margin-bottom: 10px;
    }
    @keyframes lang-grow {
        from { transform: scaleX(0); }
        to   { transform: scaleX(1); }
    }
    .lang-segment {
        height: 100%;
        border-radius: 2px;
        transform-origin: left;
        transition: filter 0.2s ease;
    }
    .lang-segment:hover {
        filter: brightness(1.4);
    }
    .lang-legend {
        display: flex;
        flex-wrap: wrap;
        gap: 5px 14px;
    }
    .lang-item {
        display: flex;
        align-items: center;
        gap: 5px;
        transition: transform 0.15s ease;
    }
    .lang-item:hover { transform: translateX(2px); }
    .lang-dot  {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
        transition: transform 0.2s ease;
    }
    .lang-item:hover .lang-dot { transform: scale(1.4); }
    .lang-name { color: #999; font-size: 11px; }
    .lang-pct  { color: #555; font-size: 10px; }

    @media (max-width: 798px) {
        .heatmap-panel {
            padding: 18px 10px 12px;
        }
        .stats-row {
            flex-wrap: wrap;
            gap: 10px;
        }
        .stat-divider {
            display: none;
        }
        .stat-num {
            font-size: 18px;
        }
    }

    @media (max-width: 480px) {
        .stats-row {
            justify-content: space-around;
        }
        .stat-block {
            align-items: center;
        }
    }
</style>