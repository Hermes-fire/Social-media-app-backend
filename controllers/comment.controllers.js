const Comment = require("../models/comment");
const Announcement = require("../models/announcement");



exports.create = async (req, res) => {
    const comment = new Comment(req.body);
    comment.userId = req.id
    try {
      const result = await comment.save();
      res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({
      error: err,
    });
    }
};


exports.addComment = async (req, res) => {
  const comment = new Comment(req.body);
  comment.userId = req.id
  try {
    const result = await comment.save();
    const announcement = await Announcement.findOneAndUpdate(
                                              {_id: result.postId}, //filter
                                              { $push: {comments:result._id}}, //update
                                              {new: true} //option
                                          )
    res.status(201).json({result,announcement});
  }catch(err) {
    return res.status(400).json({
    error: err,
  });
  }
}

/* 
exports.addComment = async (req, res) => {
    let announcement = await Announcement.findOneAndUpdate({_id: "627fc8d030f3bc7fb084e36d"},
                                  { $push:  {comments:"627fd6eb96eb5c881899ad43"}},
                                  {new: true})
    console.log(announcement);
    res.status(201).json({announcement});
} */


