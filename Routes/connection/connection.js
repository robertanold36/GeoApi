const { MongoClient } = require('mongodb');
require('dotenv/config');

const client = new MongoClient(process.env.DB_CONNECTION, { useUnifiedTopology: true });

module.exports=client;