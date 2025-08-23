import sharp from 'sharp';
import fs from 'fs';
import path from 'path';



export async function load() {
    const imgDir = path.join(process.cwd(), 'static/img');
    const files = fs.readdirSync(imgDir).filter(file => /\.(png|jpg|jpeg)$/i.test(file));
    const randomFile = files[Math.floor(Math.random() * files.length)];
    const imgPath = path.join(imgDir, randomFile);
    const buffer = await sharp(imgPath)
        .webp()
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