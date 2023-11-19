import { connectToDB } from '@/lib/mongodb';
import { isAdmin } from '@/lib/verifyJWT';

async function read(ordersCollection, skip, limit) {
    return await ordersCollection.find().skip(skip).limit(limit).toArray()
}

export default async function handler(req, res) {
    if ('GET' !== req.method) {
        res.status(405).json({ success: false, error: 'Invalid method' });
    }

    try {
        const isUserAdmin = await isAdmin(req.cookies.userToken)
        if (isUserAdmin === false) {
            throw new Error('No access.')
        }
    } catch (e) {
        return res.status(401).json({ success: false, message: "No access." });
    }

    const db = await connectToDB();
    const usersCollection = db.collection('users');

    try {
        const skip = req.query.skip ? +req.query.skip : 0
        const limit = req.query.limit ? +req.query.limit : 20

        const customers = await read(usersCollection, skip, limit)

        res.json(customers);
    } catch (e) {
        console.debug(e)
        res.status(400).json({ success: false, error: 'Error reading order' });
    }
}
