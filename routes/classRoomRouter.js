var express = require('express');
var bodyParser =require('body-parser')
var ClassRoom =require('../models/classRoom')
var authenticate=require('../authenticate')
var passport=require('passport');
var classRoomRouter = express.Router();
var cors=require('./cors');
classRoomRouter.use(bodyParser.json())

classRoomRouter.route('/')

.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    ClassRoom.find()
    .then((resp)=>{
            res.statusCode= 200
            res.setHeader('Content-Type', 'application/json');
            res.json(resp)
    })
    .catch((err)=>next(err))
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
        
        ClassRoom.findOne({className: req.body.className})
        .then((existingClassRoom) => {
            if (existingClassRoom) {
                console.log(existingClassRoom)
                // document with the same className already exists
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.json({message: 'Classroom with the same name already exists'});
            } else {
                // insert new document
                ClassRoom.create(req.body)
                    .then((newClassRoom) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Class Room Created Successful!', classRoom:newClassRoom});
                    })
                    .catch((err) => next(err));
            }
        })
        .catch((err) => next(err));
  
})

module.exports = classRoomRouter