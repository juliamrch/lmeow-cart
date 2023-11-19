import { connectToDB } from '@/lib/mongodb';
import { verifyJWT } from '@/lib/verifyJWT';

export default async function handler(req, res) {
    if ('GET' !== req.method) {
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

    res.json(user.cart)
}
