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
router.post("/", verifyToken, create);
// Get all announcement
router.get("/", verifyToken, getAllAnnouncements);
// Get annoucement by Id
router.get("/:announcementId", verifyToken, readAnnouncement);
// Get annoucement by Id and populate
router.get("/populate/:announcementIdAndPopulate", verifyToken, readAnnouncement);


router.param('announcementId', getAnnoucementById)
router.param('announcementIdAndPopulate', getAnnoucementByIdAndPopulate)

module.exports = router;
