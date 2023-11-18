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
    const productsCol = db.collection('products');

    switch (req.method) {
        case 'GET':
            try {
                const skip = req.query.skip ? +req.query.skip : 0
                const limit = req.query.limit ? +req.query.limit : 20

                const products = await read(productsCol, skip, limit)

                res.json(products);
            } catch (e) {
                console.debug(e)
                res.status(400).json({ error: 'Error reading products' });
            }
            break
        case 'PUT':
            try {
                const { name, price, category, stock, weight } = req.body;

                const form = new formidable.IncomingForm();
                form.maxFileSize = 15 * 1024 * 1024; // 15MB

                try {
                    const data = await new Promise((resolve, reject) => {
                        const form = new formidable.IncomingForm();

                        form.parse(req, (err, fields, files) => {
                            if (err) reject({ error: 'Error parsing the files' });
                            resolve({ fields, files });
                        });
                    });

                    const file = data.files.file;
                    if (!file.mimetype.startsWith('image/')) {
                        res.status(400).json({ error: 'Invalid file type' });
                        return;
                    }

                    const img = fs.readFileSync(file.filepath);
                    const image = new Binary(img);

                    await collection.insertOne({ image: image });
                    res.status(200).json({ message: 'File uploaded successfully' });

                } catch (error) {
                    res.status(500).json({ error: error.error || 'An error occurred' });
                }

                const id = await insert(productsCol, {
                    image, name, price, category, stock, weight
                })

                res.json({ id });
            } catch (e) {
                console.debug(e)
                res.status(400).json({ error: 'Failed saving product', error: e.message });
            }
            break
    }
}
