const Announcement = require("../models/announcement");

exports.create = async (req, res) => {
  if (
    !req?.body?.userId ||
    !req?.body?.categoryId ||
    !req?.body?.anDescription
  ) {
    return res.status(400).json({
      error: "User Id, Category Id and Description are required",
    });
  }
  const announcement = new Announcement(req.body);
  try {
    const result = await announcement.save();
    // 201 created
    res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

// Get all announcements
exports.getAllAnnouncements = async (req, res) => {
  // Sort by the last element
  let order = req.query.order ? req.query.order : "desc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  const announcement = await Announcement.find()
    .populate(["categoryId", "userId"])
    .sort([[sortBy, order]]);
  if (!announcement)
    return res.status(204).json({
      error: "No announcements found",
    });
  res.json(announcement);
};