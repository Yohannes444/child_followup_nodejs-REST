var express = require('express');
var bodyParser =require('body-parser')
var authenticate=require('../authenticate')
var FeedBack = require ('../models/feedBack')
var FeedBackRouter = express.Router();
var cors=require('./cors');
const mongoose = require('mongoose');
const nodemailer =require('nodemailer')
const path=require('path')

require('dotenv').config()


FeedBackRouter.use(bodyParser.json())

FeedBackRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
try{
   FeedBack.find({})
   .then((FeedBacks)=>{
    if (!FeedBacks ) {
        res.status(404);
        const err = new Error(" No FeedBacks found");
        next(err);
      }
      // If FeedBacks are found for the specified 
      res.status(200);
      res.setHeader("Content-Type", "application/json");
      res.json(FeedBacks);
   })
   .catch((err)=>next(err))
      
  }catch(err){
    res.status(404)
    next(err)}
})
  
             

.post(cors.corsWithOptions, async(req, res, next) => {
  const { firstName, lastName, phoneNumber,email,contact,reference,feedBack} = req.body;
  try {
    const newFeedBack = new FeedBack({
        firstName,
        lastName,
        phoneNumber,
        email,
        contact,
        reference,
        feedBack
    });
    const savedFeedBack = await newFeedBack.save();
    res.status(200)
    res.json(savedFeedBack);
  } catch (err) {
    console.error(err);
    res.status(500)
    next(err)
  }
})

.delete(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
  try {
    const feedBack =mongoose.Types.ObjectId (req.query.feedBackId);

    console.log(feedBack)
    FeedBack.deleteOne({ _id: feedBack })
     .then((FeedBacks)=>{
        if (!FeedBacks ) {
            res.status(404);
            const err = new Error(" No FeedBacks found");
            next(err);
          }
          res.status(200);
          res.setHeader("Content-Type", "application/json");
          res.json(FeedBacks);
       })
       .catch((err)=>next(err))
  } catch (err) {
    res.status(500);
    next(err);
  }
  
});



  module.exports = FeedBackRouter