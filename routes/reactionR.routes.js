const express = require("express");
const router = express.Router();

const { verifyToken } = require("../controllers/auth");
const {create, addReaction, getReactionById, readReaction, updateReaction, removeReaction} = require("../controllers/reactionR.controllers");

//----CRUD----
//Create
//router.post("/create", verifyToken, create);
router.post("/", verifyToken, addReaction);

//Read
router.get("/:reactionId", verifyToken, readReaction);
//Update
router.put("/:reactionId", verifyToken, updateReaction);

//Delete
router.delete('/:reactionId',verifyToken, removeReaction);

router.param('reactionId', getReactionById)

module.exports = router; 