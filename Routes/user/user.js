const express = require('express');
const router = express.Router();
const client = require('../connection/connection');

var errorMsg1 = 'Internal server error';

router.post('/', (req, res) => {

    var name = req.body.name;
    var phoneNumber = req.body.phoneNumber;

    if (name != undefined || phoneNumber != undefined) {

        client.connect().then((db) => {

            console.log('connected to database');

            var db0 = db.db("Garage");
            db0.collection('users').insertOne({
                name: name,
                phoneNumber: phoneNumber
            }, (err, result) => {
                if (err) {
                    res.status(404).end(JSON.stringify({ message: errorMsg1 }));
                } else {
                    res.status(200).end(JSON.stringify({ message: 'successfully registered', status: 'Ok' }));
                }
            });
        }).catch(err => {

            res.status(404).end(JSON.stringify({ message: errorMsg1 }));

        });

    } else {
        res.status(400).end(JSON.stringify({ message: 'no parameter passed' }));
    }



});

module.exports = router;