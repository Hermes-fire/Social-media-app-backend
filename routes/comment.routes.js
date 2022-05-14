const express = require("express");
const router = express.Router();

const { verifyToken } = require("../controllers/auth");
const {create, addComment} = require("../controllers/comment.controllers")


router.post("/create", verifyToken, create);
router.post("/addComment", verifyToken, addComment);

module.exports = router;