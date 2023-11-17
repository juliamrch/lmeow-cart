const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

function connectToDB() {
    return client.db('bg0o0lrn806q4i5yuzgn');
}

async function initSequences(name) {
    const db = connectToDB()
    const counters = db.collection('counters')

    await counters.insertOne({
        name,
        sequence: 0
    })
}

async function getNextSequence(name) {
    const db = connectToDB()
    const counters = db.collection('counters')

    const res = await counters.findOneAndUpdate(
        { name },
        { $inc: { sequence: 1 } },
        { returnDocument: 'after' }
    );

    console.log(res)

    return res.sequence;
}

module.exports = { connectToDB, getNextSequence, initSequences };
