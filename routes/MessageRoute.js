var express = require('express');
var MessageModel =require("../models/messageModel.js") 
var authenticate=require('../authenticate') 
var bodyParser =require('body-parser')
var cors=require('./cors');
const massegRouter = express.Router();
massegRouter.use(bodyParser.json())




massegRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.post(cors.corsWithOptions,authenticate.verifyUser,async (req, res) => {
    const { chatId, senderId, text } = req.body.message;
    const message = new MessageModel({
      chatId,
      senderId,
      text,
    });
    try {
      const result = await message.save();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  })


.get(cors.cors,authenticate.verifyUser, async (req, res) => {
    const  chatId  =req.query.userId;
    try {
      const result = await MessageModel.find({ chatId });
      console.log(result)
      res.status(200).json(result);
    } catch (error) {
      res.status = 500;
      return next(error);    }
  });

module.exports = massegRouter