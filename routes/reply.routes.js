const express = require("express");
const router = express.Router();

const { verifyToken } = require("../controllers/auth");
const {create, addReply, getReplyById, readReply, updateReply} = require('../controllers/reply.controllers')


//----CRUD----
//Create
router.post("/create", verifyToken, create);
router.post("/addReply", verifyToken, addReply);

//Read
router.get("/read/:replyId", verifyToken, readReply);
//Update
//router.post("/update/:replyId", verifyToken, updateReply);
//Delete
//router.delete('/remove/:replyId', verifyToken, removeReaction);



router.param('replyId', getReplyById)

module.exports = router;
