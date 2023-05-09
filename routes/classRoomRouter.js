var express = require('express');
var bodyParser =require('body-parser')
var ClassRoom =require('../models/classRoom')
var authenticate=require('../authenticate')
var passport=require('passport');
var classRoomRouter = express.Router();
var cors=require('./cors');
const { ObjectID } = require('bson');
const mongoose = require('mongoose');
classRoomRouter.use(bodyParser.json())

classRoomRouter.route('/')

.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    ClassRoom.find()
    .populate('teachersList')
    .populate('StudentsList')
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
            // document with the same className already exists
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            const err = new Error("Classroom with the same name already exists")
            return next(err)
        } else {
            // insert new document
            console.log(req.body)
            const className = req.body.className;
            const clasSize = req.body.clasSize;
            const teachersList = req.body.teachersList;
            const StudentsList = req.body.StudentsList;
            const teacherObjectIDs = teachersList.map((teacherId) => mongoose.Types.ObjectId(teacherId));

            const classRoom = {
                className: className,
                clasSize: clasSize,
                teachersList: teacherObjectIDs,
                StudentsList: StudentsList,
            };
            console.log(classRoom)
            ClassRoom.create(classRoom)                
            .then((newClassRoom) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, status: 'Class Room Created Successful!', classRoom:newClassRoom});
            })
            .catch((err) => next(err));
        }
    })
    .catch((err) => {
        console.log(err.stack); // print out the error stack trace
        next(err);
    });
  
})

classRoomRouter.route('/teacherview')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.get(cors.cors,authenticate.verifyUser,authenticate.verifyTeacher,(req,res,next)=>{
    const teacherId = req.user.id;
    console.log(teacherId)

    ClassRoom.find({ teachersList: teacherId })
    .populate('StudentsList')
    .then((classrooms) => {
        if (classrooms.length > 0) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(classrooms);
          } else {
            const err = new Error('No classrooms found for this teacher!');
            err.status = 404;
            return next(err);
          }
    })
    .catch((err) => {
      next(err)
    });

})

module.exports = classRoomRouter