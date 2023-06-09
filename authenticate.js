const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
require('dotenv').config()

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, process.env.SECRETKEY,
        {expiresIn: 9600});
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRETKEY;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        //console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    })
);

exports.verifyUser = passport.authenticate('jwt', {session: false});

exports.verifyParent=(req,res,next)=>{
    if(req.user.parent){
        if(req.user.active === true){
            next()
        }else{
            var err = new Error('plies verifie your emal account')
            err.status= 403
            return next(err)
        }
    }else{
        var err=new Error('You are not authorized to perform this operation!');
        err.status=403;
        return next(err);
    }
}

exports.verifyAdmin = (req,res,next)=>{
    if(req.user.admin)
        next();
    else{
        var err=new Error('You are not authorized to perform this operation!');
        err.status=403;
        return next(err);
    }
};

exports.verifyCashier = (req,res,next)=>{
    if(req.user.cashier){
        if(req.user.active){
            next()
        }else{
            var err = new Error('you are acoutn has bad disabled')
            err.status= 403
            return next(err)
        }
    }else{
        var err = new Error('you are not a cashier')
        err.status= 403
        return next(err)
    }
}


exports.verifyTeacher = (req,res,next)=>{
    if(req.user.teacher  ){
        if(req.user.active){
            next()
        }else{
            var err = new Error('you are acoutn has bed disabled')
            err.status= 403
            return next(err)
        }
    }else{
        var err = new Error('you are not a teacher')
        err.status= 403
        return next(err)
    }
}