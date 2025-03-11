const { MongoClient } = require('mongodb');
const dotenv = require("dotenv")

dotenv.config();

const connectionString = process.env.MONGODB_CONNECTION_STRING;
const client = new MongoClient(connectionString, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10 // connection pool
});

let db;

async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db(process.env.MONGODB_DB_NAME);
    }
    return db;
}

async function closeDB() {
    await client.close();
    console.log("Database connection closed")
}

process.on("SIGINT", async () => {
    await closeDB();
    process.exit(0);
})

module.exports = { connectDB, closeDB };