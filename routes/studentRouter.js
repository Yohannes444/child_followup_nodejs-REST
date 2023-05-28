var express = require('express');
var bodyParser =require('body-parser')
var Student =require('../models/student')
var authenticate=require('../authenticate')
var ClassRoom = require('../models/classRoom')
var studentrouter = express.Router();
var cors=require('./cors');
studentrouter.use(bodyParser.json())

studentrouter.route('/')

.get(cors.cors,authenticate.verifyUser,authenticate.verifyParent,(req,res,next)=>{ 
  
    Student.find({parent:req.user._id}) 
    .then((resp)=>{ 
        if(resp){ 

            res.statusCode= 200, 
            res.setHeader('Content-Type','application/json') 
            res.json(resp) 
        }else{ 
            res.statusCode= 404, 
            res.setHeader('Content-Type','application/json') 
            const err = new Error("ther is no chidl regsterd by this id ")
            return next(err)
            
        } 
    })
    .catch((err)=>next(err))
})


studentrouter.route('/all')
.get(cors.cors, authenticate.verifyUser, authenticate.verifyCashier, async (req, res, next) => {
    try {
        const AllStudents = await Student.find().populate('section')

        if (AllStudents) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(AllStudents);
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            const err = new Error("There are no unapproved monthly fees.");
            return next(err);
        }
    } catch (error) {
        console.error(error);
        next(error)
    }
})

module.exports = studentrouter