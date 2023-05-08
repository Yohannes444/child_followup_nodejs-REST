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

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyParent, upload.fields([{ name: 'transcript' }, { name: 'receipt' },{name:'photo'}]), (req, res, next) => {
    try{
console.log(req.files)
    // Extract the form data from the request
    const { firstName, lastName, selectedClassRoom } = req.body;
  
    // Get the paths of the uploaded files
    const transcriptPath = path.join('images', req.files['transcript'][0].originalname).split(path.sep).join('/');
    const receiptPath = path.join('images', req.files['receipt'][0].originalname).split(path.sep).join('/');
    const photoPath = path.join('images', req.files['photo'][0].originalname).split(path.sep).join('/')
    const selectedClassRooms=mongoose.Types.ObjectId (selectedClassRoom)

  
    // Create a new WightList document with the form data and file paths
    const newWightList =  {
      firstName:firstName,
      lastName:lastName,
      selectedClassRoom: selectedClassRooms,
      photo:photoPath,
      transcript: transcriptPath,
      receipt: receiptPath,
      parent: req.user._id,
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
      const error = new Error( 'Student not found in weight list')
      res.status(404)
      return next(error)   
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
        photo:student.photo,
        transcript: student.transcript,
        parent: student.parent._id,
        section: student.selectedClassRoom._id
      });

       // Find the class room
       const classRoom = await ClassRoom.findById(student.selectedClassRoom._id).populate('StudentsList');

       if (!classRoom) {
            res.status=404
            const err = new Error("Class room not found")
            return next(err)
       }
 
       // Check if class room is full
       if (classRoom.StudentsList.length >= classRoom.classSize) {
            res.status=400
            const err = new Error("Class room is full")
            return next(err)
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
        text: `ውድ ${student.parent.firstName}፣\n\nየልጅዎ ምዝገባ ተቀባይነት ማግኘቱን ለማሳወቅ እንወዳለን። ልጅዎ በ${student.selectedClassRoom.className} ተመዝግቧል እና የተማሪ መታወቂያቸው ${createdChild._id} ነው።\n\nከሠላምታ ጋር፣\n\nየልጆች ትምህርት ክትትል ቡድን'`
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
        text: `ውድ ${student.parent.firstName}፣\n\nየልጅዎ ምዝገባ ውድቅ መደረጉን ስናሳውቅዎ እናዝናለን። ለፕሮግራማችን ያላችሁን ፍላጎት እናደንቃለን ወደፊትም እንድትሞክሩ እናበረታታዎታለን።\n\nከሠላምታ ጋር፣\n\nየህፃናት ትምህርት ክትትል ቡድን`
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
      return next(err)
     
    });
})
module.exports = WightListRouter