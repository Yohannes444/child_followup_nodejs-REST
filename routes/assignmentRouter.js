var express = require('express');
var bodyParser =require('body-parser')
var WightList =require('../models/studentWignteList')
var ClassRoom =require('../models/classRoom')
var Student = require ('../models/student')
var Material = require ('../models/classMaterial')
var Assignment =require ('../models/assignmentModel')
var authenticate=require('../authenticate')
var AssignmentRouter = express.Router();
var cors=require('./cors');
const multer = require('multer');
const mongoose = require('mongoose');
const nodemailer =require('nodemailer')
const path=require('path')

require('dotenv').config()


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Assignments');
    },

    filename: (req, files, cb) => {
        cb(null, files.originalname)
    }
});

const imageFileFilter = (req, files, cb) => {
    if(!files.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
        return cb(new Error('You can upload only image files or a PDF!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter});

AssignmentRouter.use(bodyParser.json())

AssignmentRouter.route('/')

.get(cors.cors,authenticate.verifyUser,authenticate.verifyParent,(req,res,next)=>{
    Student.findById(req.body.childId) 
    .then((resp)=>{ 

        if(resp){ 
            Assignment.find({classRoom:resp.section})
            .then((resp)=>{

                    res.statusCode= 200
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp)
            })
            .catch((err)=>next(err))
        }else{ 
            res.statusCode= 404, 
            res.setHeader('Content-Type','application/json') 
            res.end("ther is no child regsterd by this id") 
        } 
    })
    .catch((err)=>next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyTeacher, upload.fields([{ name: 'file' }]), (req, res, next) => {
    try{
    // Extract the form data from the request
    const { subject, description, teacher,classRoom, quation } = req.body;
  
    // Get the paths of the uploaded files
    const quationFilePath = path.join('Assignments', req.files['file'][0].originalname).split(path.sep).join('/');
    const teacherId=mongoose.Types.ObjectId (teacher)
    const classRoomId = mongoose.Types.ObjectId(classRoom)

  
    // Create a new Assignment document with the form data and file paths
    const newAssignment =  {
        subject:subject,
        description:description,
        quation: quation,
        quationFile:quationFilePath ,
        classRoom: classRoomId,
        teacher:teacherId
    };
    // Save the new Assignment document to the database
    Assignment.create(newAssignment)
      .then(Assignment => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Assignment);
      })
      .catch(err => next(err));
    } catch (err) {
        next(err);
      }
  })
  module.exports = AssignmentRouter