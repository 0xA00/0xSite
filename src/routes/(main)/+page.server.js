import sharp from 'sharp';
import { readdir } from 'fs/promises';




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


    const imgDir = `${process.cwd()}/static/img`;
    const files = (await readdir(imgDir)).filter(file => /\.(png|jpg|jpeg)$/i.test(file));
    if (files.length === 0) {
        throw new Error('No image files found in directory');
    }
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const imgPath = `${imgDir}/${randomFile}`;
    const buffer = await sharp(imgPath)
        .resize(256, 256, { fit: 'cover' })
        .webp({ quality: 75 })
        .toBuffer();

    const base64Image = `data:image/webp;base64,${buffer.toString('base64')}`;
    if (!base64Image) {
        return new Response('Failed to convert image', { status: 500 });
    }
    
    return {
        profileImg: base64Image,
        posts
    };
}