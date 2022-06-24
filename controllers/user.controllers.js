const User = require("../models/user");
const jwt = require("jsonwebtoken");
const variables = require("../config/variables");
const { encryptNewPassword } = require("../helpers/utils");

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

// Renew Password
exports.renewPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!req?.body?.currentPassword || !req?.body?.newPassword) {
    return res.status(400).json({
      error: "The current password and new password are required",
    });
  }

  // Check if the user sign in is the same as the user id in the path param
  if (req.id != req.params.userid) {
    return res.status(403).json({
      error: "unauthorized",
    });
  }

  try {
    const findOne = await User.findOne({ _id: req.id });
    if (!findOne) {
      return res.status(400).json({
        error: "User with that id does not exist.",
      });
    } else {
      if (!findOne.authenticate(currentPassword)) {
        return res.status(401).json({
          error: "User with that Password does not exist.",
        });
      }

      // Hash the new password
      const { hashedNewPassword, salt } = encryptNewPassword(newPassword);

      const updatedPassword = await User.findByIdAndUpdate(
        { _id: req.id },
        { hashed_password: hashedNewPassword, salt: salt },
        { new: true }
      );

      if (!updatedPassword) {
        return res.status(400).json({
          error: "Error in renewing the password.",
        });
      } else {
        res.status(200).json({
          msg: "Password renewed",
        });
      }
    }
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
