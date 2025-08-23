import sharp from 'sharp';
import { readdir } from 'fs/promises';




export async function load() {
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
        profileImg: base64Image
    };
}