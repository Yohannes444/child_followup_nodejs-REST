var express = require('express');
var bodyParser =require('body-parser')
var Student =require('../models/student')
var authenticate=require('../authenticate')
const multer = require('multer');
var MonthlyFee = require('../models/monthlyFee')
const nodemailer =require('nodemailer')
var monthlyFeeRouter = express.Router();
var cors=require('./cors');
const path=require('path');
const monthlyFee = require('../models/monthlyFee');
require('dotenv').config()

monthlyFeeRouter.use(bodyParser.json())



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/receiptes');
    },

    filename: (req, files, cb) => {
        cb(null, files.originalname)
    }
});

const imageFileFilter = (req, files, cb) => {
    if(!files.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files '), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter})

monthlyFeeRouter.route('/')
.get(cors.cors, authenticate.verifyUser, authenticate.verifyCashier, async (req, res, next) => {
    try {
        const monthlyFees = await MonthlyFee.find({ approved: false }).populate('studentId')

        if (monthlyFees) {
          console.log(monthlyFees)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(monthlyFees);
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

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyParent, upload.fields([{ name: 'file' }]),(req,res,next)=>{
    console.log(req.body)
    console.log(req.files)
    try{
        const {studentId,date}=req.body
        const receiptPath = path.join('receiptes', req.files['file'][0].originalname).split(path.sep).join('/');
        const newReceipt={
            receipt:receiptPath,
            studentId:studentId,
            approved:false,
            date:date
        }
        MonthlyFee.create(newReceipt)
        .then(monthlyFee => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(monthlyFee);
          })
          .catch(err => next(err));


    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
      }
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyCashier,async(req,res,next)=>{
    const { approved, id } = req.body;
    console.log(approved, id)
    
    try {
      // Find the student in the weight list 
      const monthelyFee = await MonthlyFee.findById(id).populate('studentId')
      const student= await Student.findById(monthelyFee.studentId._id).populate('parent')
      console.log( student.parent.firstName)

      if (!monthelyFee) {
        const error = new Error( 'monthelyFee not found in weight list')
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
  
      if (approved) {
        
        //  Update monthly fee
        await MonthlyFee.findByIdAndUpdate(id, {
          $set: { approved:true}
        });
        // Send email to the parent
        mailOptions = {
          from: 'yohannesmulat444@gmail.com',
          to: student.parent.email,
          subject: 'Registration approved',
          text: `ውድ ${student.parent.firstName}፣\n\n በ ቀን ${monthelyFee.date} የከፈ ሉት የትምህርትበት ወርሃዊ ክፍያ ትክክለኛነቱን አረጋግጠናል እናመሰግና።\n\nከሠላምታ ጋር፣\n\nየህፃናት ትምህርት ክትትል ቡድን`
        };
      } else {
        // Remove the monthelyFee from the weight list  
        // Send email to the parent
        mailOptions = {
          from: 'yohannesmulat444@gmail.com',
          to: student.parent.email,
          subject: 'Registration rejected',
          text: `ውድ ${student.parent.firstName}፣\n\n በ ቀን ${monthelyFee.date} የከፈ ሉት የትምህርትበት ወርሃዊ ክፍያ ውድቅ ስለተደረገ በአካል መተው መክፈልወትን እንድታረጋግጡ ስንል እናሳስባለን።\n\nከሠላምታ ጋር፣\n\nየህፃናት ትምህርት ክትትል ቡድን`
        };
        await MonthlyFee.findByIdAndRemove(id)
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
  

  monthlyFeeRouter.route('/all')
.get(cors.cors, authenticate.verifyUser, authenticate.verifyCashier, async (req, res, next) => {
    try {
        const monthlyFees = await MonthlyFee.find().populate('studentId')

        if (monthlyFees) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(monthlyFees);
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

monthlyFeeRouter.route('/student')
.get(cors.cors, authenticate.verifyUser, authenticate.verifyCashier, async (req, res, next) => {
  const studentId= req.query.studentId
    try {
        const monthlyFees = await MonthlyFee.find({studentId:studentId}).populate('studentId')

        if (monthlyFees) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(monthlyFees);
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

module.exports = monthlyFeeRouter