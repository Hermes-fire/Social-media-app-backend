const User = require('../models/user')
const jwt = require('jsonwebtoken') //to generate signed token
const expressJwt = require('express-jwt') //for authorization check
const {errorHandler, signupEH} = require('../helpers/dbErrorHandler')
const { validationResult } = require('express-validator/check');
const user = require('../models/user');
const uid = require('../models/uid');


exports.createUid = (req,res) => {
    const uuid = new uid(req.body)
    uuid.save((err, uuid)=> {
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json({
            uuid
        });
    })
}

exports.uidById = (req, res, next, id) => {
    uid.findById(id).exec((err, uid) => {
        if(err || !uid) {
            return res.status(400).json({
                error: 'uid not found'
            })
        }
        req.uid = uid;
        next();
    })
}

exports.readUid = (req, res) => {
    console.log(req.uid)
    return res.json(req.uid);
 }

exports.signup = (req,res) => {
    console.log('signup')
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = new User(req.body)
    user.save((err, user)=> {
        if(err) {
            return res.status(400).json({
                error: signupEH(err)
            })
        }
        user.salt = undefined
        user.hashed_password = undefined
        res.json({
            user
        });
    })
}

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User with that email does not exist. Please signup'
            });
        }
        // if user is found make sure the email and password match
        // create authenticate method in user model
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: 'Email and password dont match'
            });
        }
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie('t')
    res.json({message: "Signout success"})
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id
        if(!user) {
            return res.status(403).json({
                error: 'Access denied'
            })
        }
    next();
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error:'Admin ressource! Access denied'
        })
    }
    next()
}