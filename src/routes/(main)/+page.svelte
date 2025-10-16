<script>
	import GoL from '$lib/comp/GoL.svelte';
	import MulPanel from '$lib/comp/mulPanel.svelte';
  import Panel from '$lib/comp/Panel.svelte';
	import Posts from '$lib/comp/Posts.svelte';


  export let data;
</script>

<Panel title="Description">
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

<MulPanel>

  <Panel title="Quote">
    <div class="quote">
      <blockquote>
        "A lie will remain a lie! Young Hollow, knowing this,  do you still desire peace?" - <cite>Aldia</cite>
      </blockquote>
    </div>
  </Panel>
    <Panel title="Image">
    <img src={data.profileImg} alt="Portrait of 0xA0" />
  </Panel>

</MulPanel>

<Posts posts={data.posts}/>



<style>
img {

    border-radius: 10px;
    object-fit: cover;
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
    filter: brightness(2);
}

p {
  margin-bottom: 1em;
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



</style>