const User = require("../models/user");
const jwt = require("jsonwebtoken"); //to generate signed token
const expressJwt = require("express-jwt"); //for authorization check
const {
  errorHandler,
  signupEH,
  signupErrorHandler,
} = require("../helpers/dbErrorHandler");
const { validationResult } = require("express-validator/check");
const user = require("../models/user");
const uid = require("../models/uid");
const variables = require("../config/variables");
const { json } = require("express/lib/response");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/tokenFunctions");

exports.createUid = (req, res) => {
  const uuid = new uid(req.body);
  uuid.save((err, uuid) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      uuid,
    });
  });
};

exports.uidById = (req, res, next, id) => {
  uid.findById(id).exec((err, uid) => {
    if (err || !uid) {
      return res.status(400).json({
        error: "uid not found",
      });
    }
    req.uid = uid;
    next();
  });
};

exports.readUid = (req, res) => {
  return res.json(req.uid);
};

//checkid verify if user not already signedUp, if not it returns user info from nttdata database
exports.checkUid = (req, res) => {
  user.findById(req.uid._id).exec((err, user) => {
    if (err) {
      return err;
    } else if (!user) {
      return res.json(req.uid);
    }
    return res.json({
      error: "User already signed up",
    });
  });
};

exports.signup = (req, res) => {
  uid.findById(req.body._id).exec((err, uid) => {
    if (err || !uid || uid._id != req.body._id || uid.email != req.body.email) {
      return res.json({
        error: "Forbiden",
      });
    }
    const user = new User(req.body);
    user.save((err, user) => {
      if (err) {
        return res.status(400).json({
          error: signupErrorHandler(err),
        });
      }
      user.salt = undefined;
      user.hashed_password = undefined;
      res.json({ user });
    });
  });
  /* const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } */
};
// config = {
//   secret: "some-secret-shit-goes-here",
//   refreshTokenSecret: "some-secret-refresh-token-shit",
//   port: 3000,
//   tokenLife: 900,
//   refreshTokenLife: 86400,
// };

// Store refresh tokens
let refreshTokens = [];
// Refresh token
exports.refreshToken = (req, res) => {
  // take the refresh token from the user
  const refreshToken = req.body.token;

  // send error if there is no token
  if (!refreshToken)
    return res.status(401).json({ error: "You are not authenticated" });

  //  send error if its invalid refresh token
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({
      error: "Refresh token is not valid",
    });
  }

  //   if everything is ok, create new access token, refresh token and send user

  //   Verify the refreshToken
  jwt.verify(refreshToken, variables.JWT_REFRESH_SECRET_KEY, (err, id) => {
    // if there is an error
    err && console.log(err);

    //  If it is ok
    // delete our refresh token from the Array
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    // create new access token and refresh token
    const newAccessToken = generateAccessToken(id);
    const newRefreshToken = generateRefreshToken(id);

    // push my newRefreshToken inside the Array
    refreshTokens.push(newRefreshToken);

    // send  newRefreshToken to the  user
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
};

exports.signin = (req, res) => {
  // find the user based on email
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please signup",
      });
    }
    // if user is found make sure the email and password match
    // create authenticate method in user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password dont match",
      });
    }
    // generate a signed token with user id and secret
    const accessToken = generateAccessToken(user._id);

    // Generate a refresh token
    const refreshToken = generateRefreshToken(user._id);

    // Push the refreshToken in our Array
    refreshTokens.push(refreshToken);

    // return response with user and accessToken, refreshToken to frontend client

    const { _id, name, email } = user;
    return res.json({
      accessToken,
      refreshToken: refreshToken,
      user: { _id, name, email },
    });
  });
};

// Sign out
exports.signout = (req, res) => {
  // Take refresh token
  const refreshToken = req.body.refreshToken;

  // Delete refreshToken from the Array
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json("You logged out successfully");
};

/* 
exports.signout = (req, res) => {
    //res.clearCookie('t')
    res.json({message: "Signout success"})
} */

exports.requireSignin = expressJwt({
  secret: variables.JWT_SECRET_KEY,
  algorithms: ["HS256"], // added later
  userProperty: "auth",
});

exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!user) {
    return res.status(403).json({
      error: "Access denied",
    });
  }
  next();
};
