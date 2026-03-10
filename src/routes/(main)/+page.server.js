export async function load() {
  const modules = import.meta.glob('../*/**/+page.svx', { eager: true });

  const posts = Object.entries(modules).map(([path, module]) => {
    const parts = path.split('/');
    const slug = parts[2];

    return {
      slug,
      title: module.metadata?.title ?? slug,
      author: module.metadata?.author ?? "0xA0",
      date: module.metadata?.date ?? null
    };
  });

  return {
    posts
  };
}
