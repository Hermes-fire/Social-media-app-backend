const express = require("express");
const router = express.Router();

const { verifyToken } = require("../controllers/auth");
const {
  create,
  addReaction,
  getReactionById,
  readReaction,
  updateReaction,
  removeReaction,
} = require("../controllers/reactionC.controllers");

//----CRUD----
//Create
//router.post("/create", verifyToken, create);
router.post("/", verifyToken, addReaction);
//Read
router.get("/:reactionId", verifyToken, readReaction);
//Update
router.put("/", verifyToken, updateReaction);
//Delete
router.delete("/", verifyToken, removeReaction);

router.param("reactionId", getReactionById);

module.exports = router;
