<script>
    import { onMount } from 'svelte';

    const USERNAME = '0xa00';
    const TOKEN    = import.meta.env.VITE_GITHUB_TOKEN ?? '';

    let stats       = null; // { repos, stars, followers }
    let events      = [];   // recent public events
    let repoCommits = [];   // [{ repo, repoUrl, count }] sorted desc
    let loading     = true;
    let error       = null;

    onMount(async () => {
        if (!TOKEN) {
            error = 'No VITE_GITHUB_TOKEN found.';
            loading = false;
            return;
        }
        try {
            const headers = { Authorization: `Bearer ${TOKEN}` };

            // Single GraphQL query — gets everything including private repos
            const QUERY = `
                query($login: String!) {
                    user(login: $login) {
                        publicRepos: repositories(privacy: PUBLIC) { totalCount }
                        followers { totalCount }
                        repositories(first: 100, orderBy: { field: PUSHED_AT, direction: DESC }) {
                            nodes {
                                name
                                url
                                stargazerCount
                            }
                        }
                        contributionsCollection {
                            commitContributionsByRepository(maxRepositories: 25) {
                                repository { name url }
                                contributions { totalCount }
                            }
                            recentCommitContributions: commitContributionsByRepository(maxRepositories: 5) {
                                repository { name url }
                                contributions(first: 5, orderBy: { field: OCCURRED_AT, direction: DESC }) {
                                    nodes {
                                        occurredAt
                                        commitCount
                                        repository { name url }
                                    }
                                }
                            }
                        }
                    }
                }
            `;

            const gqlRes = await fetch('https://api.github.com/graphql', {
                method: 'POST',
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: QUERY, variables: { login: USERNAME } }),
            });
            const gql = await gqlRes.json();
            if (gql.errors) throw new Error(gql.errors[0].message);

            const u = gql.data.user;

            const stars = u.repositories.nodes.reduce((acc, r) => acc + r.stargazerCount, 0);
            stats = {
                repos:     u.publicRepos.totalCount,
                followers: u.followers.totalCount,
                stars,
            };

            // Per-repo commit counts (includes private repos)
            repoCommits = u.contributionsCollection.commitContributionsByRepository
                .map(r => ({
                    repo:    r.repository.name,
                    repoUrl: r.repository.url,
                    count:   r.contributions.totalCount,
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 5);

            // Assign a color to each repo deterministically
            const REPO_COLORS = [
                '#4ec9b0', // teal
                '#569cd6', // blue
                '#ce9178', // orange
                '#c586c0', // purple
                '#dcdcaa', // yellow
                '#6a9955', // green
                '#f44747', // red
            ];
            const repoColorMap = {};
            let colorIdx = 0;
            const getRepoColor = (name) => {
                if (!repoColorMap[name]) repoColorMap[name] = REPO_COLORS[colorIdx++ % REPO_COLORS.length];
                return repoColorMap[name];
            };

            // Pre-assign colors to top repos so bar colors match activity dots
            repoCommits.forEach(r => getRepoColor(r.repo));

            // Flatten all contribution nodes with timestamps, then sort by date desc
            const flat = u.contributionsCollection.recentCommitContributions
                .flatMap(r =>
                    r.contributions.nodes.map(n => ({
                        repo:      r.repository.name,
                        repoUrl:   r.repository.url,
                        commits:   n.commitCount,
                        occurredAt: new Date(n.occurredAt),
                    }))
                )
                .sort((a, b) => b.occurredAt - a.occurredAt);

            // Group consecutive entries for the same repo
            const grouped = [];
            for (const item of flat) {
                const last = grouped[grouped.length - 1];
                if (last && last.repo === item.repo) {
                    last.commits  += item.commits;
                } else {
                    grouped.push({ ...item });
                }
            }

            events = grouped.slice(0, 4).map(g => ({
                repo:    g.repo,
                repoUrl: g.repoUrl,
                commits: g.commits,
                color:   getRepoColor(g.repo),
                timeAgo: relativeTime(g.occurredAt),
            }));

            // Apply same colors to repoCommits bars
            repoCommits = repoCommits.map(r => ({ ...r, color: getRepoColor(r.repo) }));

        } catch (e) {
            error = e.message;
        } finally {
            loading = false;
        }
    });

    function relativeTime(date) {
        const diff = Date.now() - date.getTime();
        const mins  = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days  = Math.floor(diff / 86400000);
        const weeks = Math.floor(days / 7);
        if (mins  < 60)  return `${mins}m ago`;
        if (hours < 24)  return `${hours}h ago`;
        if (days  < 7)   return `${days}d ago`;
        return `${weeks}w ago`;
    }

    function capitalize(s) {
        return s ? s[0].toUpperCase() + s.slice(1) : s;
    }
</script>

<!-- ───────────────────────────────────────────────────────────────── -->
<div class="activity-panel">
    <div class="panel-label">GitHub Activity</div>

    {#if loading}
        <div class="state-msg"><span class="blink">_</span> fetching activity…</div>

    {:else if error}
        <div class="state-msg error">{error}</div>

    {:else}
        <!-- Stats row -->
        <div class="stats-grid">
            <div class="stat-box">
                <span class="stat-value blue">{stats.repos}</span>
                <span class="stat-label">Repos</span>
            </div>
            <div class="stat-box">
                <span class="stat-value teal">{stats.stars}</span>
                <span class="stat-label">Stars</span>
            </div>
            <div class="stat-box">
                <span class="stat-value orange">{stats.followers}</span>
                <span class="stat-label">Followers</span>
            </div>
        </div>

        <!-- Commits per repo -->
        {#if repoCommits.length > 0}
            <div class="section-title">// Commits by repo <span class="muted">(last 90 days)</span></div>
            {#each repoCommits as r}
                <div class="commit-row">
                    <a href={r.repoUrl} target="_blank" rel="noreferrer" class="commit-repo">{r.repo}</a>
                    <div class="commit-bar-track">
                        <div
                            class="commit-bar-fill"
                            style="width: {(r.count / repoCommits[0].count) * 100}%; background: {r.color}"
                        ></div>
                    </div>
                    <span class="commit-count">{r.count}</span>
                </div>
            {/each}
        {/if}

        <!-- Recent activity -->
        <div class="section-title">// Recent activity</div>

        {#each events as ev}
            <div class="activity-item">
                <div class="dot" style="background: {ev.color}"></div>
                <div class="activity-body">
                    <span class="activity-text">
                        pushed to
                        <a href={ev.repoUrl} target="_blank" rel="noreferrer" style="color: {ev.color}">{ev.repo}</a>
                    </span>
                </div>
                <span class="badge" style="color: {ev.color}; border-color: {ev.color}22">
                    {ev.commits} commit{ev.commits !== 1 ? 's' : ''}
                </span>
                <span class="time">{ev.timeAgo}</span>
            </div>
        {/each}

        {#if events.length === 0}
            <div class="state-msg">No recent public activity.</div>
        {/if}
    {/if}
</div>

<!-- ───────────────────────────────────────────────────────────────── -->
<style>
    :root {
        --border: #2e2e2e;
        --text:   #c9c9c9;
        --muted:  #555555;
        --font:   'Courier New', Courier, monospace;
    }

    .activity-panel {
        position: relative;
        background: var(--background);
        border: 1px solid var(--grey);
        border-radius: 2px;
        padding: 20px 16px 16px;
        font-family: var(--font);
        color: var(--text);
        width: 100%;
        min-width: 0;
        box-sizing: border-box;
    }

    .panel-label {
        position: absolute;
        top: 0; left: 12px;
        transform: translateY(-50%);
        background: var(--background);
        padding: 0 6px;
        letter-spacing: 0.04em;
    }

    /* State */
    .state-msg { color: var(--muted); padding: 10px 0; }
    .state-msg.error { color: #ce9178; }
    .blink { animation: blink 1s step-start infinite; }
    @keyframes blink { 50% { opacity: 0; } }

    /* Commits per repo */
    .commit-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
    }
    .commit-repo {
        width: 100px;
        flex-shrink: 0;
        color: #569cd6;
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 11px;
    }
    .commit-repo:hover { text-decoration: underline; }
    .commit-bar-track {
        flex: 1;
        height: 5px;
        background: #1e1e1e;
        border: 1px solid #2a2a2a;
        border-radius: 1px;
        overflow: hidden;
    }
    .commit-bar-fill {
        height: 100%;
        background: #4ec9b0;
        border-radius: 1px;
        transition: width 1s cubic-bezier(0.4,0,0.2,1);
    }
    .commit-count {
        width: 24px;
        text-align: right;
        color: #555;
        font-size: 10px;
        flex-shrink: 0;
    }
    .muted { color: #444; font-size: 10px; }

    /* Stats */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 18px;
    }

    .stat-box {
        border: 1px solid #1e1e1e;
        background: #0d0d0d;
        padding: 10px 8px;
        text-align: center;
    }

    .stat-value {
        display: block;
        font-size: 20px;
        letter-spacing: -0.02em;
        margin-bottom: 2px;
    }
    .stat-value.blue   { color: #569cd6; }
    .stat-value.teal   { color: #4ec9b0; }
    .stat-value.orange { color: #ce9178; }

    .stat-label {
        color: var(--muted);
        font-size: 10px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
    }

    /* Section title */
    .section-title {
        color: #569cd6;
        font-size: 11px;
        letter-spacing: 0.06em;
        margin-bottom: 10px;
    }

    /* Activity items */
    .activity-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 6px 0;
        border-bottom: 1px solid #1a1a1a;
    }
    .activity-item:last-child { border-bottom: none; }

    .dot {
        width: 6px; height: 6px;
        border-radius: 50%;
        flex-shrink: 0;
        margin-top: 4px;
    }

    .badge {
        font-size: 10px;
        border: 1px solid;
        padding: 1px 5px;
        border-radius: 2px;
        white-space: nowrap;
        flex-shrink: 0;
        letter-spacing: 0.02em;
    }

    .activity-body { flex: 1; min-width: 0; }

    .activity-text {
        line-height: 1.5;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .activity-text a {
        color: #569cd6;
        text-decoration: none;
    }
    .activity-text a:hover { text-decoration: underline; }

    .detail {
        color: #555;
        margin-left: 2px;
    }

    .time {
        color: #444;
        white-space: nowrap;
        font-size: 10px;
        margin-top: 2px;
        flex-shrink: 0;
    }

    /* Responsive */
    @media (max-width: 798px) {
        .activity-panel {
            padding: 18px 10px 12px;
        }
        .commit-repo {
            width: 80px;
            font-size: 10px;
        }
        .activity-item {
            flex-wrap: wrap;
            gap: 4px 8px;
        }
    }

    @media (max-width: 480px) {
        .stats-grid {
            grid-template-columns: 1fr;
            gap: 6px;
        }
        .stat-box {
            display: flex;
            align-items: center;
            gap: 8px;
            text-align: left;
            padding: 8px;
        }
        .stat-value {
            display: inline;
            font-size: 18px;
            margin-bottom: 0;
        }
        .commit-repo {
            width: 60px;
        }
        .badge {
            font-size: 9px;
        }
    }
</style>
