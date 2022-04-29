const express = require("express");
const router = express.Router();
//const { check, validationResult } = require('express-validator/check');
const {
  createSimUser,
  readSimUser,
  checkSimUser,
  simUserById,
  signup,
  signin,
  signout,
  refreshToken,
  verifyToken,
  validate,
} = require("../controllers/auth");
const { userSignupValidator } = require("../validator");

//user in simulation dababase
router.post("/createsimuser", createSimUser);
router.get("/readsimuser/:simuser", readSimUser);
router.get("/checksimuser/:simuser", checkSimUser); // check if SimUser exist & not signedup
router.param("simuser", simUserById);

//sign in/up/out
router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.post("/signout", verifyToken, signout);

// Verify token validity
router.get("/verifytoken", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token is valid",
    id: req.id,
  });
});
// Refresh token endpoint
router.post("/refreshtoken", refreshToken);

//email validation
router.get("/verify/:id/:token", validate)



module.exports = router;
