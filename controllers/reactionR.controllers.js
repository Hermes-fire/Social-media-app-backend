const ReactionR = require("../models/reactionR")
const Reply = require("../models/reply")

exports.create = async (req, res) => {
    const reaction = new ReactionR(req.body);
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
  const reaction = new ReactionR(req.body);
  reaction.userId = req.id
  try {
    const result = await reaction.save();
    const reply = await Reply.findOneAndUpdate(
                                              {_id: result.replyId}, //filter
                                              { $push: {reactions:result._id}}, //update
                                              {new: true} //option
                                          )
    res.status(201).json({result,reply});
  }catch(err) {
    return res.status(400).json({
    error: err,
    });
  }
}



exports.getReactionById = (req, res, next, id) => {
  ReactionR.findById(id)
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
  const reaction = new ReactionR(req.reaction);
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
    const reply = await Reply.findOneAndUpdate(
      {_id: req.reaction.replyId}, //filter
      { $push: {reactions: req.reaction._id}}, //update
      {new: true} //option
    )
    await ReactionR.deleteOne({ _id: req.reaction._id})
    return res.status(200).json({
      msg: "removed",
    })
  } catch(err) {
  return res.status(400).json({
  error: err,
  });
  }
}