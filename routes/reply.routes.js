const express = require("express");
const router = express.Router();

const { verifyToken } = require("../controllers/auth");
const {create, addReply, getReplyById, readReply, updateReply, removeReply} = require('../controllers/reply.controllers')


//----CRUD----
//Create
//router.post("/create", verifyToken, create);
router.post("/", verifyToken, addReply);
//Read
router.get("/:replyId", verifyToken, readReply);
//Update
router.put("/:replyId", verifyToken, updateReply);
//Delete
router.delete('/:replyId', verifyToken, removeReply);



router.param('replyId', getReplyById)

module.exports = router;
