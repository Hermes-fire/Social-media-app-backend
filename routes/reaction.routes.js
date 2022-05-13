const express = require("express");
const router = express.Router();

const { verifyToken } = require("../controllers/auth");
const {create} = require("../controllers/reaction.controllers");


router.post("/create", verifyToken, create);


module.exports = router;