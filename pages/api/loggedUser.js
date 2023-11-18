import { connectToDB } from '@/lib/mongodb';
import { verifyJWT } from '@/lib/verifyJWT';

export default async function handler(req, res) {
    let token
    try {
        token = await verifyJWT(req.cookies.userToken)
    } catch (e) {
        return res.json({ user: null });
    }

    if (!token || !token.address) {
        return res.json({ user: null });
    }

    const db = await connectToDB();
    const users = db.collection('users');
    const user = await users.findOne({ address: token.address })

    if (!user) {
        return res.json(null);
    }

    return res.json(user);
};
