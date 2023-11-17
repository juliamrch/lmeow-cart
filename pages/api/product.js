import { connectToDB, getNextSequence,initSequences } from '@/lib/mongodb';

async function insert(obj) {
    const db = await connectToDB();
    const products = db.collection('products');

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
    if (req.method !== 'PUT') {
        res.status(400).json({ error: 'Invalid method' });
    }

    try {
        const { name, price, category, stock, weight } = req.body;

        const id = await insert({
            name, price, category, stock, weight
        })

        res.json({ id });
    } catch (e) {
        res.status(400).json({ error: 'Failed saving product', error: e.message });
    }
}
