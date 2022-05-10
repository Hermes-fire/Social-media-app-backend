const express = require("express");
const router = express.Router();

const {
  create,
  getAllAnnouncements,
} = require("../controllers/announcement.controllers");
const { verifyToken } = require("../controllers/auth");

// create announcement
router.post("/announcements/create", verifyToken, create);

// Get all announcement
router.get("/announcements/", verifyToken, getAllAnnouncements);

module.exports = router;
