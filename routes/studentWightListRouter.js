var express = require('express');
var bodyParser =require('body-parser')
var WightList =require('../models/studentWignteList')
var ClassRoom =require('../models/classRoom')
var authenticate=require('../authenticate')
var WightListRouter = express.Router();
var cors=require('./cors');
const multer = require('multer');

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
    WightList.find()
    .then((resp)=>{
            res.statusCode= 200
            res.setHeader('Content-Type', 'application/json');
            res.json(resp)
    })
    .catch((err)=>next(err))
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyParent, upload.fields([{ name: 'transcript', maxCount: 1 }, { name: 'receipt', maxCount: 1 }]),(req,res,next)=>{
    const { firstName, lastName } = req.body;
    const transcriptFile = req.files['transcript'][0];
    const receiptFile = req.files['receipt'][0];

        console.log(req.files)
        res.status=500
        res.end('ther is no code for this task writen yote')
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyParent,(req,res,next)=>{

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