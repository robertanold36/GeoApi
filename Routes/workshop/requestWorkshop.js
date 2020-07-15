const express = require('express');
const router = express.Router();
const { ObjectId }=require('mongodb').ObjectID;
require('dotenv/config')
const client = require('../connection/connection');


router.get('/', async (req, res) => {

    var errorMsg1 = 'workshop id not found';
    var errorMsg2 = 'internal server error';
    var errorMsg3 = 'Bad Request';


    var workshopID = req.query.workshopID != undefined ? req.query.workshopID : req.query.workshopID = null;

    if (workshopID == null) {
        res.status(400).end(JSON.stringify({ message: errorMsg3 }));
    } else {
       await client.connect().then(async(db) => {

            console.log('db is connected successfully');
            var db0 = db.db("Garage");
            var query = { _id: new ObjectId(workshopID) };
            await db0.collection("WorkshopCollection").find(query).toArray((err, result) => {
                if (err) {
                    console.log(req.url);
                    res.status(404).end(JSON.stringify({ message: errorMsg2 }));
                } else {
                    if (result.length != 0) {
                        
                        //res.status(200).end(JSON.stringify(result));
                        res.json(result);
                        


                    } else {
                        res.status(400).end(JSON.stringify({ message: errorMsg1 }));
                        
                    }
                }
            })

        

        }).catch((err) => {
            res.status(404).end(JSON.stringify({ message: errorMsg2 }));
            console.log('db is not successfully connected '+err);
        });
    }
})

module.exports = router