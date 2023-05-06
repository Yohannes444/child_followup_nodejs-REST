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

.get(cors.cors,authenticate.verifyUser,authenticate.verifyParent,(req,res,next)=>{
    Grade.find({})
    .then((resp)=>{
            res.statusCode= 200
            res.setHeader('Content-Type', 'application/json');
            res.json(resp)
    })
    .catch((err)=>next(err))
})

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyTeacher, async(req, res, next) => {
  const { semester, student, date } = req.body;
  try {
    const newGrade = new Grade({
      semester:semester,
      student:student,
      date:date,
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
      throw err;
    }
  
    // If grades are found for the specified student, extract the student object and return them
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