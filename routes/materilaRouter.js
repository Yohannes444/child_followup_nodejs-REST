var express = require('express');
var bodyParser =require('body-parser')
var ClassRoom =require('../models/classRoom')
var Student = require ('../models/student')
var Material = require ('../models/classMaterial')
var authenticate=require('../authenticate')
var MaterialRouter = express.Router();
var cors=require('./cors');
const multer = require('multer');
const mongoose = require('mongoose');
const nodemailer =require('nodemailer')
const path=require('path')

require('dotenv').config()


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/materials');
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

MaterialRouter.use(bodyParser.json())

MaterialRouter.route('/')

.get(cors.cors,authenticate.verifyUser,authenticate.verifyParent,(req,res,next)=>{
    Student.findById(req.query.studentId) 
    .then((resp)=>{ 
        if(resp){ 
            Material.find({classRoom:resp.section})
            .then((resp)=>{
                    res.statusCode= 200
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp)
            })
            .catch((err)=>next(err))
        }else{ 
            res.statusCode= 404, 
            res.setHeader('Content-Type','application/json') 
            const err = new Error("ther is no child regsterd by this id")
            return next(err)
        } 
    })
    .catch((err)=>next(err))
    
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyTeacher, upload.fields([{ name: 'file' }]), (req, res, next) => {
    try{

    // Extract the form data from the request
    const { subject, description, teacher,classRoom } = req.body;
  
    // Get the paths of the uploaded files
    const materialPath = path.join('materials', req.files['file'][0].originalname).split(path.sep).join('/');
    const teacherId=mongoose.Types.ObjectId (teacher)
    const classRoomId = mongoose.Types.ObjectId(classRoom)

  
    // Create a new Material document with the form data and file paths
    const newMaterial =  {
      subject:subject,
      description:description,
      classRoom: classRoomId,
      teacher: teacherId,
      file: materialPath,
    };
    // Save the new Material document to the database
    Material.create(newMaterial)
      .then(Material => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(Material);
      })
      .catch(err => next(err));
    } catch (err) {
        next(err);
      }
  })
  module.exports = MaterialRouter