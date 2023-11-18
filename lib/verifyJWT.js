import jwt from 'jsonwebtoken';
import { connectToDB } from './mongodb';

export async function verifyJWT(token) {
    if (!token) {
        throw new Error("No token provided.")
    }

    const db = connectToDB();
    const websiteBLJWTCollection = db.collection('website_users_blacklisted_jwt');
    const blacklisted = await websiteBLJWTCollection.findOne({ jwt: token })

    if (blacklisted) {
        throw new Error("Token has been logged out.")
    }

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                reject("Failed to authenticate token.");
                return;
            }

            resolve(decoded)
        });
    });
}

export async function isAdmin(token) {
    try {
        const data = await verifyJWT(token)

        if (!data || !data.address || !data.isAdmin) {
            return false
        }

        return true
    } catch (e) {
        return false
    }
}