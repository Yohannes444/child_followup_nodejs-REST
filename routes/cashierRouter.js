var express = require('express');
var User =require('../models//user')
var authenticate=require('../authenticate')
var bodyParser =require('body-parser')
var cashierRouter = express.Router();
var cors=require('./cors');

cashierRouter.use(bodyParser.json())

cashierRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    User.find({cashier:true})
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



// PUT /cashiers/:id
cashierRouter.route('/:cashierId')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.get(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    User.findById(req.params.cashierId)
    .then((resalt)=>{
        if(resalt){
            if(resalt.cashier){
                res.statusCode =200
                res.setHeader('Content-Type','application/json')
                res.Json(resalt)
            }else{
                res.statusCode= 403,
                res.setHeader('Content-Type','application/json')
                res.end("ther is user is not chasier")
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
    res.end('POST operation not supported on /:cashierId/'+ req.params.cashierId);
})
.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, async (req, res) => {
  const { firstName, lastName, email } = req.body
  const { id } = req.params.cashierId

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
    res.end('delete operation not supported on /:cashierId/'+ req.params.cashierId);
})




// PUT /cashiers/:id/active
cashierRouter.route('/:cashierId/active')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.get(cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,(req,res)=>{
    res.statusCode = 403;
    res.end('get operation not supported on /:cashierId/active'+ req.params.cashierId);
})

.post(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /:cashierId/active'+ req.params.cashierId);
})

.put(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin,async(req,res,next)=>{
  
  const  id  = req.params.cashierId
  try {
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ message: 'User not found by me' })
    }

    if (!user.cashier) {
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
    res.end('delete operation not supported on /:cashierId/active'+ req.params.cashierId);
})


module.exports = cashierRouter