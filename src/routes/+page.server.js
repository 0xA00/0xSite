import sharp from 'sharp';



export async function load() {
    const imgPath = 'static/img/0xa0.png';
    const buffer = await sharp(imgPath)
        .webp()
        .resize(256)
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