var express = require('express');
var ChatModel =require("../models/chatModel.js");
var authenticate=require('../authenticate') 
var bodyParser =require('body-parser')
var cors=require('./cors');
const cahtRouter = express.Router()
cahtRouter.use(bodyParser.json())



cahtRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.post(cors.corsWithOptions,authenticate.verifyUser, async (req, res) => {
    const newChat = new ChatModel({
      members: [req.body.senderId, req.body.receiverId],
    });
    try {
      const result = await newChat.save();
      res.status(200).json(result);
    } catch (error) {
        res.status = 500;
        return next(error);
    }
  })

cahtRouter.route('/:userId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.get(cors.cors,authenticate.verifyUser,async (req, res) => {
    try {
      const chat = await ChatModel.find({
        members: { $in: [req.params.userId] },
      });
      console.log(chat)
      res.status(200).json(chat);
    } catch (error) {
      res.status = 500;
      return next(error);
    }
  })

cahtRouter.route('/find/:firstId/:secondId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.get(cors.cors,authenticate.verifyUser,async (req, res) => {
    try {
      const chat = await ChatModel.findOne({
        members: { $all: [req.params.firstId, req.params.secondId] },
      });
      res.status(200).json(chat)
    } catch (error) {
      res.status = 500;
      return next(error);    }
  })

  module.exports = cahtRouter