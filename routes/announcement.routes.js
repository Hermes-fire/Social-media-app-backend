const express = require("express");
const router = express.Router();

const {
  create,
  getAllAnnouncements,
  getAnnoucementById,
  getAnnoucementByIdAndPopulate,
  readAnnouncement
} = require("../controllers/announcement.controllers");
const { verifyToken } = require("../controllers/auth");

// create announcement
router.post("/announcements/create", verifyToken, create);
// Get all announcement
router.get("/announcements/", verifyToken, getAllAnnouncements);

// Get annoucement by Id
router.get("/announcements/:announcementId", verifyToken, readAnnouncement);
// Get annoucement by Id and populate
router.get("/announcements/populate/:announcementIdAndPopulate", verifyToken, readAnnouncement);


router.param('announcementId', getAnnoucementById)
router.param('announcementIdAndPopulate', getAnnoucementByIdAndPopulate)

module.exports = router;
