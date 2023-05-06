var express = require('express');
var bodyParser =require('body-parser')
var Student =require('../models/student')
var authenticate=require('../authenticate')
const multer = require('multer');
var MonthlyFee = require('../models/monthlyFee')
var monthlyFeeRouter = express.Router();
var cors=require('./cors');
const path=require('path')

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

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyParent, upload.fields([{ name: 'file' }]),(req,res,next)=>{
    try{
        const receiptPath = path.join('receiptes', req.files['file'][0].originalname).split(path.sep).join('/');

        const newReceipt={
            receipt:receiptPath,
            approved:false
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
module.exports = monthlyFeeRouter