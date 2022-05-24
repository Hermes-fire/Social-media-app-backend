const SimUser = require("../models/simuser");
const user = require("../models/user");
const jwt = require("jsonwebtoken"); //to generate signed token
const expressJwt = require("express-jwt"); //for authorization check
const { signupErrorHandler } = require("../helpers/dbErrorHandler");
const User = require("../models/user");
const variables = require("../config/variables");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../helpers/email");
const NavbarInfo = require("../models/navbarInfo");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/tokenFunctions");

exports.createSimUser = async (req, res) => {
  if (!req.body?.fname || !req.body?.lname || !req.body?.email) {
    return res.status(400).json({
      error: "First name, Last name and Email are required",
    });
  }
  const simUser = new SimUser(req.body);
  try {
    const result = await simUser.save();
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

exports.simUserById = async (req, res, next, id) => {
  SimUser.findById(id).exec((err, simUser) => {
    if (err || !simUser) {
      return res.status(400).json({
        error: "uid not found",
      });
    }
    req.simUser = simUser;
    next();
  });
};

exports.readSimUser = (req, res) => {
  return res.json(req.simUser);
};

//checkid verify if user not signedUp, if not => returns user info from simulation database
exports.checkSimUser = (req, res) => {
  User.findById(req.simUser._id).exec((err, user) => {
    if (err) {
      return err;
    } else if (!user) {
      return res.json(req.simUser);
    }
    return res.json({
      error: "User already signed up",
    });
  });
};

exports.signup = (req, res) => {
  SimUser.findById(req.body._id).exec((err, simUser) => {
    if (
      err ||
      !simUser ||
      simUser._id != req.body._id ||
      simUser.email != req.body.email
    ) {
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

      const token = new Token({
        userId: req.body._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      token.save((err, token) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        }
        const message = `${process.env.BASE_URL}/auth/verify/${user.id}/${token.token}`;
        sendEmail("amine.sadali@gmail.com", "Verify Email", message); //add to .env, remplace with variable email
      });
      res.json({ user });
    });
  });
};

//email validation
exports.validate = (req, res) => {
  User.findById(req.params.id).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    if (user.verified) {
      return res.send("user already verified");
    }
    Token.findOne({
      userId: user._id,
      token: req.params.token,
    }).exec((err, token) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      console.log(user._id);
      User.updateOne({ _id: user._id }, { verified: true }).exec(
        (err, user) => {
          if (err) {
            return res.status(400).json({
              error: err,
            });
          }
          Token.findByIdAndRemove(token._id).exec((err) => {
            if (err) {
              return res.status(400).json({
                error: err,
              });
            }
            res.send("email verified sucessfully");
          });
        }
      );
    });
  });
};

// Store refresh tokens
let refreshTokens = [];
// Refresh token
exports.refreshToken = (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken)
    return res.status(401).json({ error: "You are not authenticated" });
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({
      error: "Refresh token is not valid",
    });
  }
  jwt.verify(refreshToken, variables.JWT_REFRESH_SECRET_KEY, (err, id) => {
    // if error
    err && console.log(err);
    // Else delete refresh token from the Array
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    // generate new access token and refresh token
    const newAccessToken = generateAccessToken(id);
    const newRefreshToken = generateRefreshToken(id);
    refreshTokens.push(newRefreshToken);
    // send  newRefreshToken to the  user
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with that email does not exist. Please signup",
      });
    }
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password dont match",
      });
    }
    if (!user.verified) {
      return res.status(401).json({
        error: "Please verify user",
      });
    }
    // generate a signed token with user id and secret
    const accessToken = generateAccessToken(user._id);
    // Generate a refresh token
    const refreshToken = generateRefreshToken(user._id);
    // Push the refreshToken in our Array
    refreshTokens.push(refreshToken);
    const { _id, fname, lname, email, profilePicture } = user;
    return res.json({
      accessToken,
      refreshToken: refreshToken,
      user: { _id, fname, lname, email, profilePicture },
    });
  });
};

exports.signout = (req, res) => {
  const refreshToken = req.body.refreshToken;
  // remove refreshToken from the Array
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json("You logged out successfully");
};

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const accessToken = authHeader.split(" ")[1];
    jwt.verify(accessToken, variables.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({
          error: "Token is not valid!",
        });
      }
      req.id = user._id;
      next();
    });
  } else {
    return res.status(401).json({
      error: "You are not authenticated",
    });
  }
};

// Add Navbar data to db
exports.addNavbarData = async (req, res) => {
  if (!req.body?.icon || !req.body?.label) {
    return res.status(400).json({
      error: "Icon and Label are required",
    });
  }

  const navbarInfo = new NavbarInfo(req.body);

  try {
    const result = await navbarInfo.save();
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

// Get Navbar data from db
exports.getNavbarData = async (req, res) => {
  const navbarInfo = await NavbarInfo.find();

  if (!navbarInfo)
    return res.status(204).json({
      error: "No navbarInfo found",
    });
  res.json(navbarInfo);
};
