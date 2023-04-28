var express = require('express');
var User =require('../models//user')
var authenticate=require('../authenticate') 
var Attendance =require('../models/attendance')
var bodyParser =require('body-parser')
var attendanceRouter = express.Router();
var cors=require('./cors');

attendanceRouter.use(bodyParser.json())

attendanceRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})



.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyTeacher,async(req,res,next)=>{
    try {
        const { classroomId, date, students } = req.body;
        console.log(students)
        const attendance = new Attendance({
          classroomId,
          date,
          students,
        });
        const result = await attendance.save();
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
})


module.exports = attendanceRouter