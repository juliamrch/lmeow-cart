import { connectToDB, initDatabase } from '@/lib/mongodb';
import { verifyJWT } from '@/lib/verifyJWT';

export default async function handler(req, res) {
    let token
    try {
        token = await verifyJWT(req.cookies.userToken)
    } catch (e) {
        return res.status(401).json({ success: false, message: "Connect wallet first." });
    }

    if (!token || !token.address) {
        return res.status(401).json({ success: false, message: "Connect wallet first." });
    }

    const db = await connectToDB();
    const users = db.collection('users');
    const user = await users.findOne({ isAdmin: true })

    if (user) {
        return res.status(401).json({ success: false, message: "Shop has already been setup." });
    }

    try {
        await users.updateOne(
            { address: token.address },
            {
                $set: {
                    updatedAt: new Date(),
                    isAdmin: true
                }
            }
        );

        await initDatabase()

        res.json({ success: true })
    } catch (e) {
        return res.status(405).json({ success: false, message: "Failed escalating admin access." });
    }
};
