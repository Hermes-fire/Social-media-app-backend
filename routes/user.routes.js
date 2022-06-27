const express = require("express");
const router = express.Router();

const { verifyToken } = require("../controllers/auth");
const {
  readUser,
  updateUser,
  removeUser,
  getUserById,
  renewPassword,
} = require("../controllers/user.controllers");

//----CRUD----

//Read
router.get("/:userid", verifyToken, readUser);
//Update
router.put("/:userid", verifyToken, updateUser);

// Renew password
router.put("/password/:userid", verifyToken, renewPassword);

//Delete
router.delete("/:userid", verifyToken, removeUser);

router.param("userid", getUserById);

module.exports = router;
