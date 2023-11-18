import { connectToDB, getNextSequence } from '@/lib/mongodb';
import { CONFIG_COUNTERS_ORDERS } from '@/constants/config.js'
import { verifyJWT } from '@/lib/verifyJWT';

async function read(orders, skip, limit) {
    return await orders.find().skip(skip).limit(limit).toArray()
}

async function insert(orders, obj) {
    const id = await getNextSequence(CONFIG_COUNTERS_ORDERS)

    await orders.insertOne({
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: obj.user,
        cart: obj.cart,
        shippingAddress: obj.shippingAddress
    });

    return id
}

export default async function handler(req, res) {
    if (['GET', 'PUT'].indexOf(req.method) === -1) {
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

    switch (req.method) {
        case 'GET':
            if (user.isAdmin !== true) {
                res.status(401).json({ error: 'No access' });
                return
            }

            try {
                const skip = req.query.skip ? +req.query.skip : 0
                const limit = req.query.limit ? +req.query.limit : 20

                const order = await read(ordersCollection, skip, limit)

                res.json(order);
            } catch (e) {
                console.debug(e)
                res.status(400).json({ error: 'Error reading order' });
            }
            break
        case 'PUT':
            try {
                if (!user.cart || Object.keys(user.cart).length === 0) {
                    return res.status(400).json({ error: 'Cart empty' });
                }
                const { shippingAddress } = req.body
                if (!shippingAddress) {
                    return res.status(400).json({ error: 'Missing shipping address' });
                }

                const id = await insert(ordersCollection, {
                    user: user.address,
                    cart: user.cart,
                    shippingAddress
                })

                if (!(id > 0)) {
                    res.status(400).json({ error: 'Failed saving order' });
                    return
                }

                await usersCollection.updateOne(
                    { address: user.address },
                    {
                        $set: {
                            updatedAt: new Date(),
                            cart: {}
                        }
                    }
                );

                res.json({ id });
            } catch (e) {
                console.debug(e)
                res.status(400).json({ error: 'Failed saving order' });
            }
            break
    }
}
