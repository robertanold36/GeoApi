const express = require('express');
const router = express.Router();
const client = require('../connection/connection');

router.get('/', async (req, res) => {

    var lat = req.query.lat != undefined ? req.query.lat : req.query.lat = null;
    var lon = req.query.lon != undefined ? req.query.lon : req.query.lon = null;
    var msgError1 = 'Please specify your location';
    var msgError2 = 'Internal server error';
    var msgError3 = 'We cant get garage for now ';

    if (lat == null || lon == null) {
        res.status(400).end(JSON.stringify({ message: msgError1, status: 'missingParameter' }));
    } else {

        await client.connect().then((db) => {

            var db0 = db.db("Garage");
            console.log("db connected with " + lat + ", " + lon)
            db0.collection("WorkshopPosition").find({
                location:
                {
                    $nearSphere: {
                        $geometry:
                        {
                            type: "Point", coordinates:
                                [parseFloat(lat), parseFloat(lon)]
                        },
                        $maxDistance: 4000
                    }
                }
            }).toArray((err, result) => {
                if (err) {
                    console.log(err)
                    res.status(404).end(JSON.stringify({ message: msgError3, status: 'internal server error' }));

                }
                else {

                    res.status(200).end(JSON.stringify({ status: 'ok', count: result.count, result: result }));
                }
            });
            
            

        }).catch(err => {

            console.log("db not connected " + err);
            res.status(404).end(JSON.stringify({ message: msgError2, status: 'internal server error' }));

        });

    }

})

module.exports = router;