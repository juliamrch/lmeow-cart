import { connectToDB } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { address } = req.body;
    if (!address) {
        return res.status(400).json({ error: "Address is required." });
    }

    const nonce = uuidv4();
    const message = generateMessage(address, nonce);

    const db = await connectToDB();
    const websiteUsersCollection = db.collection('users');

    await websiteUsersCollection.findOneAndUpdate(
        { address },
        {
            $setOnInsert: { address, createdAt: new Date() },
            $set: { updatedAt: new Date(), messageToSign: message }
        },
        {
            upsert: true,
            returnDocument: 'after'
        }
    )

    return res.json({ message });
}

function generateMessage(address, nonce) {
    const issuanceTime = new Date().toISOString();

    return `${address}

By signing, you are proving you own this wallet and logging in. This does not initiate a transaction or cost any fees.

URI: ${process.env.NEXT_PUBLIC_DOMAIN}
Version: 1
Chain ID: 1
Nonce: ${nonce}
Issued At: ${issuanceTime}
Resources:
- http://${process.env.NEXT_PUBLIC_DOMAIN}`;
}
