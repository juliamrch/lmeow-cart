const { MongoClient, Binary } = require('mongodb');
import { CONFIG_COUNTERS_PRODUCTS, CONFIG_COUNTERS_ORDERS } from '@/constants/config.js'

const client = new MongoClient(process.env.MONGODB_ADDON_URI);

function connectToDB() {
    return client.db(process.env.MONGODB_DATABASE);
}

async function initDatabase() {
    const db = connectToDB()
    const config = db.collection('config')

    await config.createIndex({ key: 1 }, { unique: true });
    await db.collection('users').createIndex({ address: 1 }, { unique: true });

    await config.insertOne({
        key: CONFIG_COUNTERS_PRODUCTS,
        value: 0
    })
    await config.insertOne({
        key: CONFIG_COUNTERS_ORDERS,
        value: 0
    })
}

async function getNextSequence(key) {
    const db = connectToDB()

    const res = await db.collection('config').findOneAndUpdate(
        { key },
        { $inc: { value: 1 } },
        {
            returnDocument: 'after'
        }
    );

    return res.value;
}

module.exports = { connectToDB, Binary, getNextSequence, initDatabase };
