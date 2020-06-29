const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
const { ObjectId }=require('mongodb').ObjectID;
require('dotenv/config')
const client = new MongoClient(process.env.DB_CONNECTION, { useUnifiedTopology: true });

router.get('/', async (req, res) => {

    var errorMsg1 = 'workshop id not found';
    var errorMsg2 = 'internal server error';

    var workshopID = req.query.workshopID != undefined ? req.query.workshopID : req.query.workshopID = null;

    if (workshopID == null) {
        res.status(404).end(JSON.stringify({ message: errorMsg1 }));
    } else {
       await client.connect().then(db => {

            console.log('db is connected successfully');
            var db0 = db.db("Garage");
            var query = { _id: new ObjectId(workshopID) };
            db0.collection("WorkshopCollection").findOne(query,(err, result) => {
                if (err) {
                    res.status(404).end(JSON.stringify({ message: errorMsg2 }));
                } else {
                    if (result.length != 0) {
                        console.log(req.url);
                        //res.status(200).end(JSON.stringify(result));
                        res.json(result);

                    } else {
                        res.status(404).end(JSON.stringify({ message: errorMsg2 }));
                    }
                }
            })

        }).catch(err => {
            res.status(404).end(JSON.stringify({ message: errorMsg2 }));
            console.log('db is not successfully connected');
        });
    }
})

module.exports = router