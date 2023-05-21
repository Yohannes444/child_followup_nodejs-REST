var express = require('express');
var bodyParser =require('body-parser')
var authenticate=require('../authenticate')
var Grade = require ('../models/greed')
var GradeRouter = express.Router();
var cors=require('./cors');
const mongoose = require('mongoose');
const nodemailer =require('nodemailer')
const path=require('path')

require('dotenv').config()




GradeRouter.use(bodyParser.json())

GradeRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.get(cors.cors, authenticate.verifyUser, authenticate.verifyTeacher, async (req, res, next) => {
  const classroomId = req.query.classId;
  const teacherId = req.user._id;
  try {
    const grades = await Grade.find({ classroomId: classroomId, 'student.teacherId': teacherId }).populate('student.studentId');
    
    if (!grades || grades.length === 0) {
      res.status(404);
      const err = new Error("No grades found for the specified student");
      return next(err);
    }
    
    let studentGrades = [];
    if (grades && grades.length > 0) {
      studentGrades = grades.map((grade) => grade.student[0]);
    }
    
    console.log(studentGrades);
    res.status(200);
    res.setHeader("Content-Type", "application/json");
    res.json(studentGrades);
  } catch (err) {
    res.status(404);
    return next(err);
  }
})

             

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyTeacher, async(req, res, next) => {
  const { semester, student, date,classroomId} = req.body;
  try {
    const teacherId = req.user._id;
    const gradedStudents = student.map(s => ({...s,teacherId:teacherId}));
    const newGrade = new Grade({
      semester,
      student: gradedStudents,
      date,
      classroomId
    });
    const savedGrade = await newGrade.save();
    res.status(200).json(savedGrade);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

    
GradeRouter.route('/child')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.get(cors.cors, authenticate.verifyUser, authenticate.verifyParent, async (req, res, next) => {
  try {
    const studentId = req.query.studentId;
    // Find the grades for the specific student using the student ID
    const grades = await Grade.find({ 'student.studentId': studentId });
    if (!grades || grades.length === 0) {
      res.status(404);
      const err = new Error("No grades found for the specified student");
      next(err);
    }
    // If grades are found for the specified student, extract the student object and return them  6450c4f7a4b86f2eb7c21b4e
    let studentGrades = [];
    if (grades && grades.length > 0) {
      studentGrades = grades.map((grade) => grade.student[0]);
    }
    res.status(200);
    res.setHeader("Content-Type", "application/json");
    res.json(studentGrades);
  } catch (err) {
    res.status(500);
    next(err);
  }
  
});



  module.exports = GradeRouter