var express = require('express');
var User =require('../models//user')
var authenticate=require('../authenticate') 
var Student = require('../models/student')
var Attendance =require('../models/attendance')
var bodyParser =require('body-parser')
var attendanceRouter = express.Router();
var cors=require('./cors');

attendanceRouter.use(bodyParser.json())

attendanceRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})



.get(cors.cors, authenticate.verifyUser, authenticate.verifyParent, async (req, res, next) => {
  const studentId = req.query.studentId;
  try {
    const student = await Student.findById(studentId)
    const Attendances = await Attendance.find({ classroomId: student.section, 'students.studentId': studentId }).populate('students.studentId');

    if (!Attendances || Attendances.length === 0) {
      res.status(404);
      const err = new Error("No Attendances found for the specified student");
      return next(err);
    }
    
    let studentAttendances = [];
    if (Attendances && Attendances.length > 0) {
      studentAttendances = Attendances.map((attendance) => {
        return {
          date: attendance.date,
          present: attendance.students.find((student) => student.studentId.equals(studentId))
        };
      });
    }
    
    console.log(studentAttendances);
    res.status(200);
    res.setHeader("Content-Type", "application/json");
    res.json(studentAttendances);
  } catch (err) {
    res.status(404);
    return next(err);
  }
})


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

attendanceRouter.route('/teacher')

.get(cors.cors, authenticate.verifyUser, authenticate.verifyTeacher, async (req, res, next) => {
  const teacherId = req.user._id;
  const classRoomId = req.query.classRoomId
  try {
    const student = await Student.findById(teacherId)
    const Attendances = await Attendance.find({ classroomId: classRoomId, 'students.teacherId': teacherId }).populate('students.studentId');

    if (!Attendances || Attendances.length === 0) {
      res.status(404);
      const err = new Error("No Attendances found for the specified class room");
      return next(err);
    }
    
    let studentAttendances = [];
   if (Attendances && Attendances.length > 0) {
      studentAttendances = Attendances.map((attendance) => {
       // console.log(attendance)
        return {
          date: attendance.date,
          present: attendance.students.map((student) => student)
        };
      });
    }
    
    res.status(200);
    res.setHeader("Content-Type", "application/json");
    res.json(studentAttendances);
  } catch (err) {
    res.status(404);
    return next(err);
  }
})

module.exports = attendanceRouter