import { connectToDB } from '@/lib/mongodb';
import Web3 from "web3";
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    const { address, signature } = req.body;

    if (!signature) {
        return res.status(401).json({ success: false, message: "Missing signature." });
    }

    const db = await connectToDB();
    const websiteUsersCollection = db.collection('users');

    const user = await websiteUsersCollection.findOne({ address });
    if (!user) {
        return res.status(401).json({ success: false, message: "Missing message to sign." });
    }

    const web3 = new Web3();
    const recoveredAddress = web3.eth.accounts.recover(user.messageToSign, signature);

    if (web3.utils.toChecksumAddress(recoveredAddress) !== web3.utils.toChecksumAddress(address)) {
        return res.status(401).json({ success: false, message: "Signature verification failed" });
    }

    await websiteUsersCollection.updateOne({ address }, { $set: { updatedAt: new Date(), hasSigned: true } });

    const newToken = jwt.sign({ address }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.setHeader('Set-Cookie', `userToken=${newToken}; HttpOnly; Secure; Path=/; Max-Age=${30 * 24 * 60 * 60}`);

    res.status(200).json({ success: true, message: "Logged in successfully" });
};
