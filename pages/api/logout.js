import { connectToDB } from '@/lib/mongodb';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const jwt = req.cookies.userToken

        if (jwt) {
            const db = await connectToDB();
            const websiteBLJWTCollection = db.collection('website_users_blacklisted_jwt');

            await websiteBLJWTCollection.insertOne({ jwt, timestamp: Date.now() })
        }

        res.setHeader('Set-Cookie', 'jwt=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict');
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
