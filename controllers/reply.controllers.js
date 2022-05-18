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

exports.updateReply = async (req, res) => {
  const reply = new Reply(req.reply);
  if(!req.body.reply){
    return res.status(400).json({
      error: 'please specify a reply',
      });
  }
  //check if user own comment
  if(req.id != req.reply.userId){
    return res.status(403).json({
      error: 'unauthorized',
      });
  }
  try{
    await reply.updateOne({reply: req.body.reply})
    return res.json({
      msg: "updated"
    })
  } catch(err) {
  return res.status(400).json({
  error: err,
  });
}}

exports.removeReply = async (req, res) => {
  if(req.id != req.reply.userId){ //test this condition with different user !!
    return res.status(403).json({
      error: 'unauthorized',
      });
  }
  try{
    console.log(req.reply)
    const comment = await Comment.findOneAndUpdate(
      {_id: req.reply.commentId}, //filter
      { $pull: {replies:req.reply._id}}, //update
      {new: true} //option
    )
    await Reply.deleteOne({ _id: req.reply._id})
    return res.status(200).json({
      msg: "removed",
      comment: comment
    })
  } catch(err) {
  return res.status(400).json({
  error: err,
  })
  }
}