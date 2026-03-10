<script>
	import Ascii from '$lib/comp/ascii.svelte';
	import MulPanel from '$lib/comp/mulPanel.svelte';
  import Panel from '$lib/comp/Panel.svelte';
	import Posts from '$lib/comp/Posts.svelte';
  import Heatmap from '$lib/comp/heatmap.svelte';
  import Ghactivity from '$lib/comp/ghactivity.svelte';

  export let data;
</script>

<MulPanel>

  <Panel title="Description">
    <Ascii />
    <p> Hi ! My name is <span class="highlight">0xA0</span>, but you can also call me 0x.</p>

    <p>I'm a recent computer science graduate but also new <span class="highlight">42 school's student</span> !
      This website is meant to show my work and projects.</p>

    <p>Feel free to explore and reach out if you have any questions!</p>

    <p>You can find me on various platforms:</p>
    <ul>
      <li>GitHub: <a href="https://github.com/0xA00">0xA00</a></li>
      <li>Twitter: <a href="https://twitter.com/0xA0_">@0xA0_</a></li>
      <li>Discord: <a href="https://discordapp.com/users/298221448642953217">0xA0</a></li>
    </ul>

  </Panel>

  <div class="sidebar">
    <Panel title="Quote">
      <blockquote>
        "A lie will remain a lie! Young Hollow, knowing this, do you still desire peace?"
        <cite>— Aldia</cite>
      </blockquote>
    </Panel>
    <Posts posts={data.posts} />
  </div>
</MulPanel>
<MulPanel>
  <Heatmap />
  <Ghactivity />
 

</MulPanel>



<style>
p {
  margin-bottom: 1em;
}

li {
  list-style: none;
  padding-left: 1.5em;
}
li::before {
  content: "- ";
  color: var(--accent);
}

blockquote {
  margin: 1em 0;
  padding: 0.5em 1em;
  border-left: 4px solid var(--accent);
  background: var(--background);
  text-align: left;

    cite {
      display: block;
      text-align: right;
      font-size: 0.8em;
      color: var(--secondary);
    }
}


.highlight {
    color: var(--accent);
    font-weight: bold;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1em;
}


</style>