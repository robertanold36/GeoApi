const express=require('express');
const router=express.Router();
const {MongoClient}=require('mongodb');
require('dotenv/config');

const client=new MongoClient(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });


//const geo=require('ngeohash');
const Geo=require('geo-nearby');

const data=[
    {"location":{"coordinates":[-6.839758,39.240246],"type":"Point"},"name":"Bugurunu"},
    {"location":{"coordinates":[-6.847598,39.229259],"type":"Point"},"name":"VIgunguti"},
    {"location":{"coordinates":[-6.841292,39.198360],"type":"Point"},"name":"Segerea"},
    {"location":{"coordinates":[-6.829190,39.227886],"type":"Point"},"name":"Tabata"},
    {"location":{"coordinates":[-6.830895,39.262390],"type":"Point"},"name":"Ilala"},
    {"location":{"coordinates":[-6.809078,39.202995],"type":"Point"},"name":"makuburi"}

];



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

    client.connect().then((db)=>{

        var db0=db.db("Garage");
                console.log("db connected")
                db0.collection("sample").findOne({ location: 
                    { $nearSphere: { $geometry: 
                        { type: "Point", coordinates:
                         [ -6.846584,39.196204 ] }, 
                         $maxDistance: 4000 } } },(err,result)=>{
                             if(err){console.log(err)}else{
                                 res.json(result);
                             }
                         });
    
    }).catch(err=>{
        console.log("db not connected");
    });

       // db0.collection("sample").insertMany(data,(err,res)=>{
            //     if(err){console.log(err);}
            //     else{
            //         console.log("data inserted "+res);
            //     }
            // });
         

            // db0.collection("sample").createIndex({ location:"2dsphere" },(err)=>{
            //     if(err){
            //         console.log('err '+err);
            //     }else{
            //         console.log("successfully");
            //     }
            // })
            

    // client.connect((err,db)=>{
    
    //     if(err){
    //         res.status(404).end(JSON.stringify({message:msgError2,status:'internal server error'}));  
    //         console.log('fail to connect to database '+err);

    //     }else{
    //         console.log('db connected');
    //         var db0=db.db("Garage");

    //         db0.collection("sample").findOne({ location: 
    //             { $nearSphere: { $geometry: 
    //                 { type: "Point", coordinates:
    //                  [ -6.846584,39.196204 ] }, 
    //                  $maxDistance: 3000 } } },(err,result)=>{
    //                      if(err){console.log(err)}else{
    //                          res.json(result);
    //                      }
    //                  });


          
    //     }
    // })
   }

})

module.exports=router;