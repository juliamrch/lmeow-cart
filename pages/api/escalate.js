import { connectToDB } from '@/lib/mongodb';
import { verifyJWT } from '@/lib/verifyJWT';
import { CONFIG_IS_SHOP_SETUP } from '@/constants/config.js'

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
    const config = db.collection('config');

    const isShopSetup = await config.findOne({ key: CONFIG_IS_SHOP_SETUP })
    if (isShopSetup && isShopSetup.value === true) {
        return res.status(401).json({ success: false, message: "Shop has already been setup." });
    }

    const users = db.collection('users');

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

        await config.insertOne({
            key: CONFIG_IS_SHOP_SETUP,
            value: true,
        });

        res.json({ success: true })
    } catch (e) {
        return res.status(405).json({ success: false, message: "Failed escalating admin access." });
    }
};
