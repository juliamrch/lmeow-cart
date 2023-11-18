import { connectToDB, Binary, getNextSequence } from '@/lib/mongodb';
import { CONFIG_COUNTERS_PRODUCTS } from '@/constants/config.js'
import formidable from 'formidable';
import fs from 'fs';

async function read(products, skip, limit) {
    return await products.find().skip(skip).limit(limit).toArray()
}

async function insert(products, obj) {
    const id = await getNextSequence(CONFIG_COUNTERS_PRODUCTS)

    products.insertOne({
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: obj.name,
        price: obj.price,
        category: obj.category,
        stock: obj.stock,
        weight: obj.weight,
    });

    return id
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req, res) {
    if (['GET', 'PUT'].indexOf(req.method) === -1) {
        res.status(405).json({ error: 'Invalid method' });
    }

    const db = await connectToDB();
    const productsCollection = db.collection('products');

    switch (req.method) {
        case 'GET':
            try {
                const skip = req.query.skip ? +req.query.skip : 0
                const limit = req.query.limit ? +req.query.limit : 20

                const products = await read(productsCollection, skip, limit)

                res.json(products);
            } catch (e) {
                console.debug(e)
                res.status(400).json({ error: 'Error reading products' });
            }
            break
        case 'PUT':
            try {
                const form = formidable({});
                form.maxFileSize = 15 * 1024 * 1024; // 15MB

                let fields;
                let files;

                [fields, files] = await form.parse(req);

                console.log(fields, files)

                if (!fields.name || !fields.price || !fields.stock || !fields.weight || !fields.category) {
                    res.status(400).json({ error: 'Missing product data' });
                    return;
                }

                const file = data.files.file;
                if (!file.mimetype.startsWith('image/')) {
                    res.status(400).json({ error: 'Invalid file type' });
                    return;
                }

                const img = fs.readFileSync(file.filepath);
                const image = new Binary(img);

                fields.image = image

                const id = await insert(productsCollection, fields)

                res.json({ id });
            } catch (e) {
                console.debug(e)
                res.status(400).json({ error: 'Failed saving product', error: e.message });
            }
            break
    }
}
