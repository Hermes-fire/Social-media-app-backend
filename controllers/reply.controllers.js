const Reply = require('../models/reply')
const Comment = require('../models/comment')


exports.create = async (req, res) => {
    const reply = new Reply(req.body);
    reply.userId = req.id
    try {
      const result = await reply.save();
      res.status(201).json(result);
    } catch (err) {
      return res.status(400).json({
        error: err,
      });
    }
};



exports.addReply = async (req, res) => {
  const reply = new Reply(req.body);
  reply.userId = req.id
  try {
    const result = await reply.save();
    const comment = await Comment.findOneAndUpdate(
                                              {_id: result.commentId}, //filter
                                              { $push: {replies:result._id}}, //update
                                              {new: true} //option
                                          )
    res.status(201).json({result,comment});
  }catch(err) {
    return res.status(400).json({
    error: err,
    });
  }
}

exports.getReplyById = (req, res, next, id) => {
  Reply.findById(id)
    .exec((err, reply) => {
      if(err || !reply) {
          return res.status(400).json({
              error: 'reply not found'
          })
      }
      req.reply = reply 
      next()
  })
}

exports.readReply = (req, res) => {
  return res.json(req.reply);
};
/*
exports.updateReaction = async (req, res) => {
  const reaction = new Reaction(req.reaction);
  if(!req.body.reaction){
    return res.status(400).json({
      error: 'please specify a reaction',
      });
  }
  //check if user own comment
  if(req.id != req.reaction.userId){
    return res.status(403).json({
      error: 'unauthorized',
      });
  }
  try{
    await reaction.updateOne({reaction: req.body.reaction})
    return res.json({
      msg: "updated"
    })
  } catch(err) {
  return res.status(400).json({
  error: err,
  });
}}

exports.removeReaction = async (req, res) => {
  if(req.id != req.reaction.userId){
    return res.status(403).json({
      error: 'unauthorized',
      });
  }
  try{
    const announcement = await Announcement.findOneAndUpdate(
      {_id: req.reaction.postId}, //filter
      { $pull: {reactions:req.reaction._id}}, //update
      {new: true} //option
    )
    await Reaction.deleteOne({ _id: req.reaction._id})
    return res.status(200).json({
      msg: "removed",
      announcement: announcement
    })
  } catch(err) {
  return res.status(400).json({
  error: err,
  });
  }
} */