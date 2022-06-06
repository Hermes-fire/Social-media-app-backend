const Comment = require("../models/comment");
var ObjectId = require('mongoose').Types.ObjectId; 

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
    res.status(201).json({result});
  }catch(err) {
    return res.status(400).json({
    error: err,
    });
  }
}

exports.getCommentById = (req, res, next, id) => {
  Comment.findById(id)
    .populate('userId', '-email -hashed_password -salt -verified -createdAt -updatedAt -__v')
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

exports.getCommentByPostId = (req, res, next, id) => {
  Comment.count({ "postId": id})
  .exec((err, count) => {
    if(err){
      return res.status(200).json({
        error: err
    })
    }
    if(!count) {
      return res.status(200).json({
          error: 'post has no comment'
      })
    }
    req.postId = id
    req.count = count 
    Comment.find({ "postId": id, "_id": { "$nin": req.body.seenIds }})
      .sort({createdAt: 'desc'})
      .limit(2)
      .populate('reactions', '-postId -commentId -__v')
      .populate('replies', '-postId -commentId  -__v')
      .populate('userId', '-email -hashed_password -salt -verified -createdAt -updatedAt -__v')
      .exec((err, comment) => {
        if(err || !comment) {
            return res.status(200).json({
                error: 'comments not found (find)'
            })
        }
        req.comment = comment 
        next()
      })
  })
}

exports.readComment = (req, res) => {
  if(!req.postId){
    return res.status(200).json(req.comment)
  }
  return res.status(200).json({ [req.postId]:{
                                total : req.count,
                                comments : req.comment                              
                              }});
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
    return res.status(403).json({
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
    return res.status(403).json({
      error: 'unauthorized',
      });
  }
  try{
    await Comment.deleteOne({ _id: req.comment._id})
    return res.status(200).json({
      msg: "removed",
      announcement: announcement
    })
  } catch(err) {
  return res.status(400).json({
  error: err,
  });
  }
}