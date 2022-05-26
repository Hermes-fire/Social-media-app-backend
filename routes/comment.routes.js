const express = require("express");
const router = express.Router();

const { verifyToken } = require("../controllers/auth");
const {create, addComment, getCommentById, getCommentByPostId, getCommentCountByPostId,
     readComment, updateComment, removeComment} = require("../controllers/comment.controllers")

//----CRUD----
//Create
router.post("/create", verifyToken, create);
router.post("/addComment", verifyToken, addComment);
//Read
router.get("/read/:commentId", verifyToken, readComment);
router.post("/getCommentByPostId/:postId", verifyToken, readComment); //post seensIds to get comment
router.get("/getCommentCountByPostId/:postIdCount", verifyToken, readComment); //get comment count
//Update
router.put("/update/:commentId", verifyToken, updateComment);
//Delete
router.delete('/remove/:commentId',verifyToken, removeComment)

router.param('commentId', getCommentById)
router.param('postId', getCommentByPostId)
router.param('postIdCount', getCommentCountByPostId)


module.exports = router;