export async function load({ url }) {
  const modules = import.meta.glob('./**/+page.svx', { eager: true });
  const slug = url.pathname.split('/').filter(Boolean).at(-1);
  const match = Object.entries(modules).find(([path]) => path.includes(`/${slug}/`));
  const title = match?.[1]?.metadata?.title ?? slug;

  return { title };
}
