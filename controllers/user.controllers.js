const User = require("../models/user");
const jwt = require("jsonwebtoken");
const variables = require("../config/variables");

exports.getUserById = (req, res, next, id) => {
  User.findById(id, "-hashed_password -salt -updatedAt -createdAt -__v ").exec(
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "user not found",
        });
      }
      req.user = user;
      next();
    }
  );
};

exports.readUser = (req, res) => {
  return res.json(req.user);
};

exports.updateUser = async (req, res) => {
  const user = new User(req.user);
  if (!req?.body?.fname || !req?.body?.lname) {
    return res.status(400).json({
      error: "First and last name are required",
    });
  }
  // console.log("req.id :", req.id);
  // console.log("req.params.userid :", req.params.userid);
  // Check if the user sign in is the same as the user id in the path param
  if (req.id != req.params.userid) {
    return res.status(403).json({
      error: "unauthorized",
    });
  }
  // userId: monaim : 6273abee8d9e8b8a1cec4897
  // userId: younes : 6272ba693395f9480da8065c

  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.id },
      {
        fname: req.body.fname,
        lname: req.body.lname,
        profilePicture: req.body.profilePicture,
        jobTitle: req.body.jobTitle,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
      },
      { new: true }
      //Return Updated document
    ).select("-hashed_password -salt -updatedAt -createdAt -__v "); //Expect these fields
    return res.json({
      updatedUser,
      msg: "updated",
    });
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

exports.removeUser = async (req, res) => {
  // Check if the user sign in is the same as the user id in the path param
  if (req.id != req.params.userid) {
    return res.status(403).json({
      error: "unauthorized",
    });
  }

  try {
    // await User.deleteOne({ _id: req.id });
    return res.status(200).json({
      msg: "removed",
    });
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};
