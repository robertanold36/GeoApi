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

   if(lat==null || lon==null){
       res.json({ msg:'please specify your location' });
   }else{
    client.connect((err,db)=>{
        if(err){
            res.json({ msg:'fail to connect to our database' });  
            console.log('fail to connect to database');

        }else{
            console.log('db connected');
            var db0=db.db("Garage");

            db0.collection("garageState").find({}).toArray((err,result)=>{
                if(err){
                    res.json({ msg:'fail to retrive data' });
                }else{
                    if(result.length>0){
                        while(radius<=5000){
                            const geo=new Geo(result,{ id:'_id',hash:'geoHash' });
                            const sample=geo.limit(1).nearBy(lat,lon,[250,radius]);
                            if(sample.length>0){
                                console.log(radius);
                                res.json(sample);
                                break;
                            }
                            if(sample.length==0&radius==5000){
                                res.json({ msg:'no nearby garage in 5km' });
                            }
                            radius+=1000;
                        }    
                    }
                    else{
                        res.send({ msg:'current no garage' });
                    }
                }
            });
        }
    })
   }

})

module.exports=router;