const express=require('express');
const router=express.Router();
const {MongoClient}=require('mongodb');
require('dotenv/config');

const client=new MongoClient(process.env.DB_CONNECTION,{ useUnifiedTopology: true });


//const geo=require('ngeohash');
const Geo=require('geo-nearby');

router.get('/',(req,res)=>{
    
    var lat=req.query.lat!=undefined?req.query.lat:req.query.lat=null;
    var lon=req.query.lon!=undefined?req.query.lon:req.query.lon=null;
    var radius=1000;
    var msgError1='Please specify your location';
    var msgError2='Internal server error';
    var msgError3='We cant get garage for now ';
    var msgError4='No nearby garage in 5km';


   if(lat==null || lon==null){
       res.status(400).end(JSON.stringify({message:msgError1,status:'missingParameter'}));
   }else{
    client.connect((err,db)=>{
        if(err){
            res.status(404).end(JSON.stringify({message:msgError2,status:'internal server error'}));  
            console.log('fail to connect to database');

        }else{
            console.log('db connected');
            var db0=db.db("Garage");

            db0.collection("garageStateE").find({}).toArray((err,result)=>{
                if(err){
                    console.log('fail bro');
                    res.status(404).end(JSON.stringify({message:msgError3,status:'internal server error'}));

                }else{
                    if(result.length>0){
                        while(radius<=5000){
                            const geo=new Geo(result,{ id:'_id',hash:'geoHash' });
                            const sample=geo.limit(1).nearBy(lat,lon,[250,radius]);
                            if(sample.length>0){
                                console.log(radius);
                                res.status(200).end(JSON.stringify(sample));
                                break;
                            }
                            if(sample.length==0&radius==5000){

                                res.status(200).end(JSON.stringify({message:msgError4,status:'OK'}));
                            }
                            radius+=1000;
                        }    
                    }
                    else{

                        res.status(200).end(JSON.stringify({message:msgError3,status:'OK'}));
                    }
                }
            });
        }
    })
   }

})

module.exports=router;