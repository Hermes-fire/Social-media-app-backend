const Announcement = require("../models/announcement");

exports.create = (req, res) => {
  console.log("im here");
  const announcement = new Announcement(req.body);
  announcement.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({ data });
  });
};

// Get all announcements
exports.getAllAnnouncements = (req, res) => {
  // Sort by the last element
  let order = req.query.order ? req.query.order : "desc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Announcement.find()
    .populate(["categoryId", "userId"])
    .sort([[sortBy, order]])
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(data);
    });
};
