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
router.post("/create", verifyToken, create);
router.post("/addreaction", verifyToken, addReaction);
//Read
router.get("/read/:reactionId", verifyToken, readReaction);
//Update
router.put("/update/", verifyToken, updateReaction);
//Delete
router.delete("/remove/", verifyToken, removeReaction);

router.param("reactionId", getReactionById);

module.exports = router;
