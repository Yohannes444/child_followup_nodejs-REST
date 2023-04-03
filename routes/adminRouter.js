var express = require('express');
var bodyParser =require('body-parser')
var User =require('../models//user')
var authenticate=require('../authenticate')
var adminrouter = express.Router();
var cors=require('./cors');
adminrouter.use(bodyParser.json())
adminrouter.route('/')

.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    User.find()
    .then((resp)=>{
        if(resp){
            res.statusCode= 404,
            res.setHeader('Content-Type','application/json')
            res.end("ther is no user regsterd")
        }else{
            res.statusCode= 200,
            res.setHeader('Content-Type','application/json')
            res.json(resp)
        }
    })
})
