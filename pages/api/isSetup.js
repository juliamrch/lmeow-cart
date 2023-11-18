import { connectToDB } from '@/lib/mongodb';

export default async function handler(req, res) {
    const db = await connectToDB();
    const users = db.collection('users');
    const user = await users.findOne({ isAdmin: true })

    if (!user) {
        return res.json({ isAdminSetup: false });
    }

    return res.json({ isAdminSetup: user.isAdmin });
};
