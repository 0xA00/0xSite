<script>
  let { children, data } = $props();
</script>

<a href="../">← go back</a>
<h1 id="blog-title">{data.title}</h1>

<div class="blog-content">{@render children?.()}</div>

<a href="../">← go back</a>

<style>
  #blog-title {
    color: #fff;
  }

  #blog-title::before {
    content: "[ ";
    color: var(--accent);
  }

  #blog-title::after {
    content: " ]";
    color: var(--accent);
  }

  a {
    display: inline-block;
    margin-top: 1.5rem;
  }

  :global(.blog-content img) {
    display: block;
    margin: 1.5rem 0;
    max-width: 100%;
    height: auto;
  }
</style>
