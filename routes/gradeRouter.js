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
  console.log(req.body)
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
    
  module.exports = GradeRouter