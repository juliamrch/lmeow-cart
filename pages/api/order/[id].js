import { connectToDB, getNextSequence } from '@/lib/mongodb';
import { CONFIG_COUNTERS_ORDERS } from '@/constants/config.js'
import { verifyJWT } from '@/lib/verifyJWT';

async function read(orders, id) {
    return await orders.findOne({ id })
}

async function insert(orders, obj) {
    const id = await getNextSequence(CONFIG_COUNTERS_ORDERS)

    await orders.insertOne({
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: obj.user.address,
        cart: obj.user.cart,
        shippingAddress: obj.shippingAddress
    });

    return id
}

export default async function handler(req, res) {
    if (['GET', 'PUT', 'POST'].indexOf(req.method) === -1) {
        res.status(405).json({ error: 'Invalid method' });
    }

    let token
    try {
        token = await verifyJWT(req.cookies.userToken)
    } catch (e) {
        return res.status(401).json({ success: false, message: "Connect wallet first." });
    }

    if (!token || !token.address) {
        return res.json({ user: null });
    }

    const db = await connectToDB();
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ address: token.address })

    if (!user) {
        return res.status(401).json({ success: false, message: "User not found." });
    }

    const ordersCollection = db.collection('orders');

    const id = +req.query.id

    switch (req.method) {
        case 'GET':
            try {
                const order = await read(ordersCollection, id)

                if (!order || order.user !== user.address) {
                    res.status(400).json({ error: 'Error reading order' });
                    return
                }

                res.json(order);
            } catch (e) {
                console.debug(e)
                res.status(400).json({ error: 'Error reading order' });
            }
            break
    }
}
