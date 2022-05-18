const express = require("express");
const router = express.Router();

const { verifyToken } = require("../controllers/auth");
const {create, addReaction, getReactionById, readReaction, updateReaction, removeReaction} = require("../controllers/reaction.controllers");

//----CRUD----
//Create
router.post("/create", verifyToken, create);
router.post("/addReaction", verifyToken, addReaction);
//Read
router.get("/read/:reactionId", verifyToken, getReactionById, readReaction);
//Update
router.post("/update/:reactionId", verifyToken, getReactionById, updateReaction);
//Delete
router.delete('/remove/:reactionId',verifyToken, getReactionById, removeReaction);

router.param('reactionId', getReactionById)

module.exports = router;