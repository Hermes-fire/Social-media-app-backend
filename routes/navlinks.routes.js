const express = require("express");
const router = express.Router();

const {
  verifyToken
} = require("../controllers/auth");

const {
    addNavbarData,
    getNavbarData,
} = require("../controllers/navlinks.controllers")

//Add navbar data to db
router.post("/", verifyToken, addNavbarData);
//get navbar Data from db
router.get("/", verifyToken, getNavbarData);

module.exports = router;
