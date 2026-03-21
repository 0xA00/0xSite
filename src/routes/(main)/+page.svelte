<script>
	import Posts from '$lib/comp/Posts.svelte';

  export let data;
</script>

<div class="profile-header">
  {#if data.pouppyData}
    <img class="pfp" src={data.pouppyData} alt="profile picture" />
  {/if}
  <h1 id="username"><span class="highlight">0xA0</span></h1>
</div>

<p>Hi! it's me, 0xA0. I'm a 23-year-old developer (I know I'm unc).</p>
<p>Welcome to my personal canvas of expression and plot of land. I really like to redo that website every few months so don't mind the changes.</p>
<p>I'm a computer science graduate but also a 42 school's student.</p>
<p>If you want to leave a message, feel free to write something on my <a href="/guest">guestbook</a> !</p>

<h2>my socials</h2>
<ul class="socials">
  <li><a href="https://twitter.com/0xA0_" target="_blank">Twitter</a></li>
  <li><a href="https://github.com/0xA00" target="_blank">GitHub</a></li>
  <li><a href="https://discordapp.com/users/298221448642953217">Discord</a></li>
</ul>

<Posts posts={data.posts} />

<h2>buttons</h2>
<div class="buttons">
  {#each data.buttons as btn}
    {#if btn.href}
      <a href={btn.href} target="_blank" rel="noopener noreferrer">
        <img src={btn.src} alt="88x31 button" width="88" height="31" />
      </a>
    {:else}
      <img src={btn.src} alt="88x31 button" width="88" height="31" />
    {/if}
  {/each}
</div>

<style>
  p {
    margin-bottom: 1em;
  }

  .profile-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-top: 1.5rem;
    margin-bottom: 1em;
  }

  #username {
    margin: 0;
  }

  .pfp {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border: 2px solid var(--accent);
  }

  #username {
    color: #fff;
  }

  #username::before {
    content: "[ ";
    color: var(--accent);
  }

  #username::after {
    content: " ]";
    color: var(--accent);
  }

  .socials {
    list-style: none;
    padding-left: 1.5rem;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .socials li::before {
    content: "— ";
    color: var(--secondary);
  }

  .socials a {
    font-size: 0.875rem;
  }

  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .buttons img {
    image-rendering: pixelated;
  }
</style>
