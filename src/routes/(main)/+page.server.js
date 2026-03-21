import fs from 'fs';
import path from 'path';

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

  const buttonsDir = path.resolve('static/img/88x31');
  const linksPath = path.join(buttonsDir, 'links.json');
  const links = fs.existsSync(linksPath) ? JSON.parse(fs.readFileSync(linksPath, 'utf-8')) : {};

  const buttons = fs.readdirSync(buttonsDir)
    .filter(file => file !== 'links.json')
    .map(file => ({ src: `/img/88x31/${file}`, href: links[file] ?? null }));

  const pouppyPath = path.resolve('static/img/pouppy.webp');
  const pouppyData = fs.existsSync(pouppyPath)
    ? 'data:image/webp;base64,' + fs.readFileSync(pouppyPath).toString('base64')
    : null;

  return {
    posts,
    buttons,
    pouppyData
  };
}
