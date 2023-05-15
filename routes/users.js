var express = require('express');
var bodyParser =require('body-parser')
var user =require('../models//user')
var authenticate=require('../authenticate')
var passport=require('passport');
var router = express.Router();
var cors=require('./cors')
router.use(bodyParser.json())
/* GET users listing. */
router.get('/',cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
  user.findOne({_id:req.user._id})
  .then((cashier) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(cashier);
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/signup',cors.corsWithOptions, (req, res,next) => {
  console.log(req.body)
  user.register(new user({username: req.body.username}),
  req.body.password,(err,user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err:err})
      
    }
    else {
      if (req.body.firstName)
        user.firstName = req.body.firstName;
        
      if (req.body.lastName)
        user.lastName = req.body.lastName;
      if(req.body.email)
        user.email =req.body.email
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            next(err)
            return ;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!'});
          });
        })
    }
  })

});

router.post('/login',cors.corsWithOptions, (req,res,next) => {
  passport.authenticate('local',(err,user,info)=>{
    if(err){
      return next(err)
    }
    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success:false ,status: 'your loging unsuccessfuly ',err:info});
    }else{
      req.logIn(user,(err)=>{
        if(err){
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({success:false  ,status: 'liging unsuccessfuly ',err:'cold not login user'});
        }
        var token =authenticate.getToken({_id:req.user._id})
        const { _id, firstName, lastName, email, parent, admin, teacher, cashier } = req.user;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success:true,token:token ,status: 'you are logd in successfuly ', user: { _id, firstName, lastName, email, parent, admin, teacher, cashier } });
      })
    }
    
  })(req,res,next)

})

router.get('/logout',cors.corsWithOptions, (req, res,next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err)
  }
});
router.get('/facebook/token',passport.authenticate('facebook-token'),(req,res)=>{
  if(req.user){
    var token =authenticate.getToken({_id:req.user._id})
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success:true ,token:token  ,status: 'your are successfuly logdin',});
  }
})

router.get('/checkJWTToken',cors.corsWithOptions,(req,res)=>{
  passport.authenticate('jwt',{session:false},(err,user,info)=>{
    if(err)
    return next(err)
    if(!user){
      res.statusCode=401
      res.setHeader('Content-Type','application/json')
      return res.json({status:'JWT invalid!',success:false, err:info})
    }else{
      res.statusCode=200
      res.setHeader('Content-Type','application/json')
      return res.json({status:'JWT valid!',success:true, user:user})
    }
  })(req,res)
})

router.route('/admin/teacher')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.post(authenticate.verifyUser,authenticate.verifyAdmin,cors.corsWithOptions, (req, res,next) => {
  console.log(req.body)
  user.register(new user({username: req.body.username}),
  req.body.password,(err,user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err:err})
      
    }
    else {
      if (req.body.firstName)
        user.firstName = req.body.firstName;
        
      if (req.body.lastName)
        user.lastName = req.body.lastName;
      if(req.body.email)
        user.email =req.body.email
        user.parent=false
        user.teacher=true
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            next(err)
            return ;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!'});
          });
        })
    }
  })

})

router.route('/admin/cashier')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.post(authenticate.verifyUser,authenticate.verifyAdmin,cors.corsWithOptions, (req, res,next) => {
  console.log(req.body)
  user.register(new user({username: req.body.username}),
  req.body.password,(err,user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err:err})
      
    }
    else {
      if (req.body.firstName)
        user.firstName = req.body.firstName;
        
      if (req.body.lastName)
        user.lastName = req.body.lastName;
      if(req.body.email)
        user.email =req.body.email
        user.parent=false
        user.cashier=true
        user.save((err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
            next(err)
            return ;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!'});
          });
        })
    }
  })

})

router.route('/userInfo')
.options(cors.corsWithOptions,(req,res)=>{res.sendStatus(200)})

.get(cors.corsWithOptions, authenticate.verifyUser,(req,res,next) => {
  user.findOne({_id:req.query.userId})
  .then((user) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(user);
  }, (err) => next(err))
  .catch((err) => next(err));
});

module.exports = router;
 