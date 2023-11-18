import { connectToDB,Binary } from '@/lib/mongodb';

async function read(products, id) {
    return await products.findOne({ id })
}

export default async function handler(req, res) {
    const id = +req.query.id

    if ('GET' !== req.method) {
        res.status(405).json({ error: 'Invalid method' });
    }

    const db = await connectToDB();
    const products = db.collection('products');
    const product = await read(products, id)

    if (!product.imageMime || !product.image) {
        return res.status(400).send(null)
    }

    res.setHeader('Content-Type', product.imageMime);
    let imageBuffer;
    if (product.image instanceof Binary) {
        imageBuffer = product.image.read(0, product.image.length());
    } else {
        imageBuffer = product.image;
    }

    return res.status(200).send(imageBuffer);
}
