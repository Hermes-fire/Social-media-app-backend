const express = require("express");
const router = express.Router();

const { verifyToken } = require("../controllers/auth");
const {create, addReaction} = require("../controllers/reaction.controllers");


router.post("/create", verifyToken, create);
router.post("/addReaction", verifyToken, addReaction);



module.exports = router;