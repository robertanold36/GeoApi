const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv/config');


const client = new MongoClient(process.env.DB_CONNECTION, {useUnifiedTopology: true});


var errorMsg1 = 'Internal server error';

router.post('/', async (req, res) => {

    var name = req.body.name;
    var locationName = req.body.location.locationName;
    var locationLatitude = parseFloat(req.body.location.latitude);
    var locationLongitude = parseFloat(req.body.location.longitude);
    var contacts = req.body.Contacts;
    var workshopClass = req.body.workshopClass;
    var service = req.body.service;
    var vehicleBrands = req.body.vehicleBrands;
    var CompanyReview = parseInt(req.body.CompanyReview);

    client.connect().then(async (db) => {

        console.log('connected to database');

        var db0 = db.db("Garage");
        try {

            await db0.collection("WorkshopCollection").insertOne({
                name: name,
                location: {
                    locationName: locationName,
                    latitude: locationLatitude,
                    longitude: locationLongitude
                },
                service: service,
                VehicleBrands: vehicleBrands,
                contacts: contacts,
                CompanyReview: CompanyReview,
                workshopClass: workshopClass
            },async (err, res) => {
                if (err) {
                    res.status(404).end(JSON.stringify({ message: err }));

                } else {

                    const data = {
                        "location": {
                            "coordinates":
                                [locationLatitude,
                                    locationLongitude],
                            "type": "Point"
                        },
                        "workshopID": res.insertedId, state: "on"
                    };

                   await db0.collection("WorkshopPosition").insertOne(data)
                        
                }
            });

            res.status(200).end(JSON.stringify({ message:"Data inserted successfully" }))


        } catch (err) {
            res.status(404).end(JSON.stringify({ message: err }));
        }

    }).catch(err => {

        res.status(404).end(JSON.stringify({ message: errorMsg1 }));

    });



});

module.exports = router;