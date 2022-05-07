const express = require("express");
const router = express.Router();

const {
  create,
  getAllAnnouncements,
} = require("../controllers/announcement.controllers");

// create announcement
router.post("/announcements/create", create);

// Get all announcement
router.get("/announcements/", getAllAnnouncements);

module.exports = router;
