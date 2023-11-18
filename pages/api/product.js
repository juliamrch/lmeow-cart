import { connectToDB, getNextSequence, initSequences } from '@/lib/mongodb';

async function read(products, skip, limit) {
    return await products.find().skip(skip).limit(limit).toArray()
}

async function insert(products, obj) {
    const id = await getNextSequence('products')

    products.insertOne({
        id,
        name: obj.name,
        price: obj.price,
        category: obj.category,
        stock: obj.stock,
        weight: obj.weight
    });

    return id
}

export default async function handler(req, res) {
    if (['GET', 'PUT'].indexOf(req.method) === -1) {
        res.status(400).json({ error: 'Invalid method' });
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

                const id = await insert(productsCol, {
                    name, price, category, stock, weight
                })

                res.json({ id });
            } catch (e) {
                res.status(400).json({ error: 'Failed saving product', error: e.message });
            }
            break
    }
}
