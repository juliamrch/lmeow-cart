import { connectToDB } from '@/lib/mongodb';
import { isAdmin } from '@/lib/verifyJWT';

async function read(products, id) {
    return await products.findOne({ id })
}

async function update(products, id, obj) {
    await products.updateOne(
        { id },
        {
            $set: {
                updatedAt: new Date(),
                name: obj.name,
                price: obj.price,
                category: obj.category,
                stock: obj.stock,
                weight: obj.weight
            }
        }
    );
}

export default async function handler(req, res) {
    const id = +req.query.id

    if (['GET', 'POST'].indexOf(req.method) === -1) {
        res.status(405).json({ error: 'Invalid method' });
    }

    if (isAdmin(req.cookies?.userToken) !== true) {
        return res.status(401).json({ error: 'No access.' });
    }

    const db = await connectToDB();
    const products = db.collection('products');

    switch (req.method) {
        case 'GET':
            try {
                const product = await read(products, id)

                res.json(product);
            } catch (e) {
                res.status(400).json({ error: 'Error reading product' });
            }
            break
        case 'POST':
            try {
                const { name, price, category, stock, weight } = req.body

                await update(products, id, { name, price, category, stock, weight })

                res.json({ id });
            } catch (e) {
                res.status(400).json({ error: 'Error updating product' });
            }
            break
    }
}
