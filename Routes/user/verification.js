const express = require('express');
const router = express.Router();
const client = require('../connection/connection');

router.get('/', async (req, res) => {

    var userEmail = req.query.email != undefined ? req.query.email : req.query.email = null;
    var userCategory=req.query.category!=undefined?req.query.category:req.query.category=null
    var errMsg1 = "bad request";
    var errMsg2 = "internal server error";
    if (userEmail == null|| userCategory==null) {   

        res.status(400).end(JSON.stringify({ message: errMsg1 }));

    } else {
        try {
            await client.connect()
                .then(async(db) => {
                    console.log('database connected successfully');
                    var dbo=db.db("Garage");
                    var query={ email:userEmail };
                    await dbo.collection(userCategory).find(query).toArray((err,result)=>{
                        if(err){
                            res.status(404).end(JSON.stringify({ message: errMsg2 }));
                        }else{
                            if (result.length != 0) {
                                //console.log(req.url);
                                //res.status(200).end(JSON.stringify(result));
                                res.json(result);
        
                            } else {
                                res.status(401).end(JSON.stringify({ message: "Emaill Not Found" }));
                            }     
                        }
                    });          

                })
                .catch((err) => {
                    console.log("internal server error");
                });

        } catch (err) {
            console.log("something went problem");
            res.status(404).end(JSON.stringify({ message: errMsg2 }));

        }


    }
})

module.exports = router;  