const express = require("express");
const router = express.Router();

const { verifyToken } = require("../controllers/auth");
const {create, addReply} = require('../controllers/reply.controllers')


//----CRUD----
//Create
router.post("/create", verifyToken, create);
router.post("/addReply", verifyToken, addReply);



module.exports = router;
