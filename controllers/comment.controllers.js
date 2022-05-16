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


exports.getCommentById = (req, res, next, id) => {
  Comment.findById(id)
    .exec((err, comment) => {
      if(err || !comment) {
          return res.status(400).json({
              error: 'comment not found'
          })
      }
      req.comment = comment 
      next()
  })
}

exports.readComment = (req, res) => {
  return res.json(req.comment);
};


exports.updateComment = async (req, res) => {
  const comment = new Comment(req.comment);
  if(!req.body.comment){
    return res.status(400).json({
      error: 'please specify a comment',
      });
  }
  //check if user own comment
  if(req.id != req.comment.userId){
    return res.status(400).json({
      error: 'unauthorized',
      });
  }
  try{
    await comment.updateOne({comment: req.body.comment})
    return res.json({
      msg: "updated"
    })
  } catch(err) {
  return res.status(400).json({
  error: err,
  });
}}

exports.removeComment = async (req, res) => {
  if(req.id != req.comment.userId){
    return res.status(400).json({
      error: 'unauthorized',
      });
  }
  try{
    const announcement = await Announcement.findOneAndUpdate(
      {_id: req.comment.postId}, //filter
      { $pull: {comments:req.comment._id}}, //update
      {new: true} //option
    )
    await Comment.remove({ _id: req.comment._id})
    return res.json({
      msg: "removed",
      announcement: announcement
    })
  } catch(err) {
  return res.status(400).json({
  error: err,
  });
  }
}


