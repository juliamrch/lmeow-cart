import { connectToDB, Binary, getNextSequence } from '@/lib/mongodb';
import { CONFIG_COUNTERS_PRODUCTS } from '@/constants/config.js'
import formidable from 'formidable';
import fs from 'fs';
import { isAdmin } from '@/lib/verifyJWT';

async function read(products, skip, limit) {
    return await products.find().project({ image: 0 }).skip(skip).limit(limit).toArray()
}

async function insert(products, obj) {
    const id = await getNextSequence(CONFIG_COUNTERS_PRODUCTS)

    await products.insertOne({
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        image: obj.image,
        imageMime: obj.imageMime,
        description: obj.description[0],
        name: obj.name[0],
        price: obj.price[0],
        category: obj.category[0],
        stock: obj.stock[0],
        weight: obj.weight[0],
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
        res.status(405).json({ success: false, error: 'Invalid method' });
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
                res.status(400).json({ success: false, error: 'Error reading products' });
            }
            break
        case 'PUT':
            const isUserAdmin = await isAdmin(req.cookies?.userToken)
            if (isUserAdmin !== true) {
                return res.status(401).json({ success: false, error: 'No access.' });
            }

            try {
                const form = formidable({});
                form.maxFileSize = 15 * 1024 * 1024; // 15MB

                let fields;
                let files;

                [fields, files] = await form.parse(req);

                console.log(fields, files)

                if (!fields.name || !fields.description || !fields.price || !fields.stock || !fields.weight || !fields.category) {
                    res.status(400).json({ success: false, error: 'Missing product data' });
                    return;
                }

                const file = files.image[0];
                if (!file.mimetype.startsWith('image/')) {
                    res.status(400).json({ success: false, error: 'Invalid file type' });
                    return;
                }

                const img = fs.readFileSync(file.filepath);
                const image = new Binary(img);

                fields.image = image
                fields.imageMime = file.mimetype

                const id = await insert(productsCollection, fields)

                res.json({ id });
            } catch (e) {
                console.debug(e)
                res.status(400).json({ success: false, error: 'Failed saving product', error: e.message });
            }
            break
    }
}
