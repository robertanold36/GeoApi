const express=require('express');
const geo =require('ngeohash');
const path=require('path');
const app=express();
require('dotenv').config();

const port=process.env.PORT||8080;

app.use(express.json());
app.use(express.urlencoded({ extended:false }));

app.get('/', (req,res)=>{
    
    if(req.query.name==undefined||req.query.age==undefined){
        res.json({ msg:'we cant find your detail please' });
    }else{
        
        var name=req.query.name;
        var age=req.query.age;
        var count=req.query.count!=undefined?req.query.count:req.query.count=0;
        res.send(name+' has '+age+' years old total number of query is '+count);
    }
       

   
    //const hash=geo.encode_int(-6.813730,39.182812,52);
    //res.json({ hash:hash });
});

app.use('/api/nearby',require('./Routes/data/data'));

app.listen(port);