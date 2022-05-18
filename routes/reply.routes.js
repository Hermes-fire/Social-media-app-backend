const express = require("express");
const router = express.Router();

const { verifyToken } = require("../controllers/auth");
const {create} = require('../controllers/reply.controllers')


//----CRUD----
//Create
router.post("/create", verifyToken, create);


module.exports = router;
