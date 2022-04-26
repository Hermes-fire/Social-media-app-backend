const User = require('../models/user')
const jwt = require('jsonwebtoken') //to generate signed token
const expressJwt = require('express-jwt') //for authorization check
const {errorHandler, signupEH, signupErrorHandler} = require('../helpers/dbErrorHandler')
const { validationResult } = require('express-validator/check');
const user = require('../models/user');
const uid = require('../models/uid');
const Token = require('../models/token');
const crypto = require('crypto')
const sendEmail = require("../utils/email");
const token = require('../models/token');




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
    return res.json(req.uid);
}


//checkid verify if user not already signedUp, if not it returns user info from nttdata database
exports.checkUid = (req, res) => {
    user.findById(req.uid._id).exec((err, user) => {
        if(err){
            return err
        }else if(!user) {
            return res.json(req.uid)
        }
        return res.json({
            error: "User already signed up"
        });
    })
}

exports.signup = (req,res) => {
    uid.findById(req.body._id).exec((err, uid) => {
        if(err || !uid || uid._id != req.body._id || uid.email != req.body.email){
            return res.json({
                error: 'Forbiden'
            })
        }
        const user = new User(req.body)
        user.save((err, user)=> {
            if(err) {
                return res.status(400).json({
                    error: signupErrorHandler(err)
                })
            }
            user.salt = undefined
            user.hashed_password = undefined
            
            const token = new Token({
                userId: req.body._id,
                token: crypto.randomBytes(32).toString('hex')
            })
            token.save((err, token)=> {
                if(err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                const message = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`;
                console.log(message)
                sendEmail('amine.sadali@gmail.com', "Verify Email", message);
            })
            res.json({user});
        })
    })
    /* const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } */
}

exports.validate = (req, res) => {
    user.findById(req.params.id).exec((err,user)=>{
        if(err) {
            return res.status(400).json({
                error: err
            })
        }
        if(user.verified){
            return res.send('user already verified')
        }
        token.findOne({
            userId: user._id,
            token: req.params.token,
          }).exec((err,token)=>{
            if(err) {
                return res.status(400).json({
                    error: err
                })
            }
            user.updateOne({ _id: user._id, verified: true }).exec((err,user)=>{
                if(err) {
                    return res.status(400).json({
                        error: err
                    })
                }
                Token.findByIdAndRemove(token._id).exec((err)=>{
                    if(err) {
                        return res.status(400).json({
                            error: err
                        })
                    }
                    res.send("email verified sucessfully")
                })
            });
          })
    })
}

    /* try {
      const user = await user.findOne({ _id: req.params.id });
      console.log(user)
      if (!user) return res.status(400).send("Invalid link");
  
      const token = await token.findOne({
        userId: user._id,
        token: req.params.token,
      });
      if (!token) return res.status(400).send("Invalid link");
  
      await user.updateOne({ _id: user._id, verified: true });
      await token.findByIdAndRemove(token._id);
  
      res.send("email verified sucessfully");
    } catch (error) {
        res.json({
            error: error
        });
    } 
  }
*/
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
        if (!user.verified) {
            return res.status(401).json({
                error: 'Please verify user'
            });
        }
        // generate a signed token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET,{expiresIn: '1h'} );
        // persist the token as 't' in cookie with expiry date
        //res.cookie('t', token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, email} = user;
        return res.json({ token, user: { _id, name, email } });
    });
};
/* 
exports.signout = (req, res) => {
    //res.clearCookie('t')
    res.json({message: "Signout success"})
} */

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