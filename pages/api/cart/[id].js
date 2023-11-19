import { connectToDB } from '@/lib/mongodb';
import { verifyJWT } from '@/lib/verifyJWT';

export default async function handler(req, res) {
    if (['DELETE', 'PUT'].indexOf(req.method) === -1) {
        res.status(405).json({ success: false, error: 'Invalid method' });
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

    if (!user.cart) {
        user.cart = {}
    }

    let quantity = req.body.quantity ? +req.body.quantity : 1;
    const id = +req.query.id

    const producsCollection = db.collection('products');
    const product = await producsCollection.findOne({ id }, { projection: { image: 0 } })
    if (!product) {
        return res.status(401).json({ success: false, message: "Product not found." });
    }

    switch (req.method) {
        case 'PUT':
            product.quantity = quantity
            user.cart[product.id] = product
            break
        case 'DELETE':
            delete user.cart[product.id]
            break
    }

    try {
        await usersCollection.updateOne(
            { address: user.address },
            {
                $set: {
                    updatedAt: new Date(),
                    cart: user.cart
                }
            }
        );

        res.json({ success: true })
    } catch (e) {
        res.json({ success: false, message: "Failed updating cart." })
    }
}
