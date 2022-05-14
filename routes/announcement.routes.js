const express = require("express");
const router = express.Router();

const {
  create,
  getAllAnnouncements,
  getAnnoucementById,
  readAnnouncement
} = require("../controllers/announcement.controllers");
const { verifyToken } = require("../controllers/auth");

// create announcement
router.post("/announcements/create", verifyToken, create);
// Get all announcement
router.get("/announcements/", verifyToken, getAllAnnouncements);
// Get annoucement by Id
router.get("/announcements/:announcementId", verifyToken, getAnnoucementById, readAnnouncement);


router.param('announcementId', getAnnoucementById)

module.exports = router;
