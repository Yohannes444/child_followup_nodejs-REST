var express = require('express');
var bodyParser =require('body-parser')
var WightList =require('../models/studentWignteList')
var ClassRoom =require('../models/classRoom')
var Student = require ('../models/student')
var authenticate=require('../authenticate')
var WightListRouter = express.Router();
var cors=require('./cors');
const multer = require('multer');
const mongoose = require('mongoose');
const nodemailer =require('nodemailer')
const path=require('path')

require('dotenv').config()




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
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

WightListRouter.use(bodyParser.json())

WightListRouter.route('/')

.get(cors.cors,authenticate.verifyUser,authenticate.verifyCashier,(req,res,next)=>{
    WightList.find({})
    .then((resp)=>{
            res.statusCode= 200
            res.setHeader('Content-Type', 'application/json');
            res.json(resp)
    })
    .catch((err)=>next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyParent, upload.fields([{ name: 'transcript' }, { name: 'receipt' }]), (req, res, next) => {
    try{
console.log(req.files)
    // Extract the form data from the request
    const { firstName, lastName, selectedClassRoom } = req.body;
  
    // Get the paths of the uploaded files
    const transcriptPath = path.join('images', req.files['transcript'][0].originalname).split(path.sep).join('/');
const receiptPath = path.join('images', req.files['receipt'][0].originalname).split(path.sep).join('/');
    const selectedClassRooms=mongoose.Types.ObjectId (selectedClassRoom)

  
    // Create a new WightList document with the form data and file paths
    const newWightList =  {
      firstName:firstName,
      lastName:lastName,
      selectedClassRoom: selectedClassRooms,
      transcript: transcriptPath,
      receipt: receiptPath,
      parent: req.user._id,
      approved: false
    };
    // Save the new WightList document to the database
    WightList.create(newWightList)
      .then(wightList => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(wightList);
      })
      .catch(err => next(err));
    } catch (err) {
        next(err);
      }
  })

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyCashier,async(req,res,next)=>{
  const { approve, id } = req.body;
  console.log(approve, id)
  
  try {
    // Find the student in the weight list
    const student = await WightList.findById(id).populate('selectedClassRoom').populate('parent');

    if (!student) {
      return res.status(404).json({ error: 'Student not found in weight list' });
    }

    // Send email to the parent
    const transporter = nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:"yohannesmulat444@gmail.com",
        pass: process.env.GMAIL_PASSWORD
      }
    });

    let mailOptions;

    if (approve) {
      // Create the student
      const newChild = new Student({
        firstName: student.firstName,
        lastName: student.lastName,
        transcript: student.transcript,
        parent: student.parent._id,
        section: student.selectedClassRoom._id
      });

       // Find the class room
       const classRoom = await ClassRoom.findById(student.selectedClassRoom._id).populate('StudentsList');

       if (!classRoom) {
         return res.status(404).json({ error: 'Class room not found' });
       }
 
       // Check if class room is full
       if (classRoom.StudentsList.length >= classRoom.classSize) {
         return res.status(400).json({ error: 'Class room is full' });
       }

      const createdChild = await newChild.save();

      
      // Add the student to the class room's student list
      await ClassRoom.findByIdAndUpdate(student.selectedClassRoom._id, {
        $push: { StudentsList: createdChild._id }
      });

      // Send email to the parent
      mailOptions = {
        from: 'yohannesmulat444@gmail.com',
        to: student.parent.email,
        subject: 'Registration approved',
        text: `Dear ${student.parent.firstName},\n\nWe are pleased to inform you that your child's registration has been approved. Your child has been enrolled in ${student.selectedClassRoom.className} and their student ID is ${createdChild._id}.\n\nBest regards,\n\nThe Child Education Follow Up team`
      };
      await WightList.findByIdAndRemove(id);
    } else {
      // Remove the student from the weight list
      await WightList.findByIdAndRemove(id);

      // Send email to the parent
      mailOptions = {
        from: 'yohannesmulat444@gmail.com',
        to: student.parent.email,
        subject: 'Registration rejected',
        text: `Dear ${student.parent.firstName},\n\nWe regret to inform you that your child's registration has been rejected. We appreciate your interest in our program and encourage you to try again in the future.\n\nBest regards,\n\nThe Child Education Follow Up team`
      };
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.json({ message: 'Registration request processed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }

})

WightListRouter.route('/freeSpace')

.get(cors.cors,authenticate.verifyUser,authenticate.verifyParent,(req,res)=>{
    ClassRoom.find({})
    .then((classRooms) => {
      const freeClassRooms = classRooms.filter((classRoom) => {
        return classRoom.StudentsList.length < classRoom.clasSize && classRoom.clasSize > 0;
      });
      
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.json(freeClassRooms);
    })
    .catch((err) => {
      res.status(500);
      res.setHeader('Content-Type', 'application/json');
      res.json({ error: err });
    });
})
module.exports = WightListRouter