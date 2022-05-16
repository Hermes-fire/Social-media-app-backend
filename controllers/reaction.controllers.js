const Reaction = require("../models/reaction");
const Announcement = require("../models/announcement");


exports.create = async (req, res) => {
    const reaction = new Reaction(req.body);
    reaction.userId = req.id
    try {
      const result = await reaction.save();
      res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({
        error: err,
      });
    }
};

exports.addReaction = async (req, res) => {
  const reaction = new Reaction(req.body);
  reaction.userId = req.id
  try {
    const result = await reaction.save();
    const announcement = await Announcement.findOneAndUpdate(
                                              {_id: result.postId}, //filter
                                              { $push: {reactions:result._id}}, //update
                                              {new: true} //option
                                          )
    res.status(201).json({result,announcement});
  }catch(err) {
    return res.status(400).json({
    error: err,
    });
  }
}



exports.getReactionById = (req, res, next, id) => {
  Comment.findById(id)
    .exec((err, reaction) => {
      if(err || !reaction) {
          return res.status(400).json({
              error: 'reaction not found'
          })
      }
      req.reaction = reaction 
      next()
  })
}

exports.readReaction = (req, res) => {
  return res.json(req.reaction);
};


exports.updateReaction = async (req, res) => {
  const reaction = new Reaction(req.reaction);
  if(!req.body.reactionType){
    return res.status(400).json({
      error: 'please specify a reaction',
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