var express = require('express');
var User =require('../models//user')
var authenticate=require('../authenticate')
var bodyParser =require('body-parser')
var teacherRouter = express.Router();
var cors=require('./cors');

teacherRouter.use(bodyParser.json())

teacherRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    User.find({teacher:true})
    .then((resp)=>{
        if(resp){
            res.statusCode= 200,
            res.setHeader('Content-Type','application/json')
            res.json(resp)
        }else{
            res.statusCode= 404,
            res.setHeader('Content-Type','application/json')
            res.end("ther is no user regsterd")
        }
    })
})


teacherRouter.route('/:teacherId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.get(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    User.findById(req.params.teacherId)
    .then((resalt)=>{
        if(resalt){
            if(resalt.cashier){
                res.statusCode =200
                res.setHeader('Content-Type','application/json')
                res.Json(resalt)
            }else{
                res.statusCode= 403,
                res.setHeader('Content-Type','application/json')
                res.end("ther is user is not tacher")
            }
        }else{
            res.statusCode= 404,
            res.setHeader('Content-Type','application/json')
            res.end("ther is no user regsterd")
        }
    })
})
.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /:teacherId/'+ req.params.teacherId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, async (req, res) => {
  const { firstName, lastName, email } = req.body
  const { id } = req.params.teacherId

  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!user.cashier) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.email = email || user.email

    const updatedUser = await user.save()
    return res.status(200).json(updatedUser)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('delete operation not supported on /:teacherId/'+ req.params.teacherId);
})




// PUT /cashiers/:id/active
teacherRouter.route('/:teacherId/active')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>{
    res.statusCode = 403;
    res.end('get operation not supported on /:teacherId/active'+ req.params.teacherId);
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /:teacherId/active'+ req.params.teacherId);
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, async (req, res) => {
  const  id  = req.params.teacherId
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found by me' })
    }

    if (!user.teacher) {
      return res.status(403).json({ message: 'Forbidden' })
    }

    user.active = !user.active

    const updatedUser = await user.save()
    return res.status(200).json(updatedUser)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error' })
  }
})
.delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>{
    res.statusCode = 403;
    res.end('delete operation not supported on /:teacherId/active'+ req.params.teacherId);
})

module.exports = teacherRouter