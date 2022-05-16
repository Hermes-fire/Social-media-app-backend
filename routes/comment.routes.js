const express = require("express");
const router = express.Router();

const { verifyToken } = require("../controllers/auth");
const {create, addComment, getCommentById, readComment, updateComment, removeComment} = require("../controllers/comment.controllers")

//----CRUD----
//Create
router.post("/create", verifyToken, create);
router.post("/addComment", verifyToken, addComment);
//Read
router.get("/read/:commentId", verifyToken, getCommentById, readComment);
//Update
router.post("/update/:commentId", verifyToken, getCommentById, updateComment);
//Delete
router.delete('/remove/:commentId',verifyToken, getCommentById, removeComment)


router.param('commentId', getCommentById)

module.exports = router;