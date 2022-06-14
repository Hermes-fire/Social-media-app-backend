const ReactionC = require("../models/reactionC");
const Comment = require("../models/comment");

exports.create = async (req, res) => {
  const reaction = new ReactionC(req.body);
  reaction.userId = req.id;
  try {
    const result = await reaction.save();
    console.log(result + "heelo");
    res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

exports.addReaction = async (req, res) => {
  const reaction = new ReactionC(req.body);
  reaction.userId = req.id;
  try {
    //add this check - ( user can have only one reaction)
    // find reaction with commentId and userId
    // If exist return "user already reacted to this comment"
    const result = await reaction.save();
    const comment = await Comment.findOneAndUpdate(
      { _id: result.commentId }, //filter
      { $push: { reactions: result._id } }, //update
      { new: true } //option
    );
    res.status(201).json({ result, comment });
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

exports.getReactionById = (req, res, next, id) => {
  console.log("here");
  ReactionC.findById(id).exec((err, reaction) => {
    if (err || !reaction) {
      return res.status(400).json({
        error: "reaction not found",
      });
    }
    req.reaction = reaction;
    next();
  });
};

exports.readReaction = (req, res) => {
  return res.json(req.reaction);
};

exports.updateReaction = async (req, res) => {
  if (!req?.body?.userId || !req?.body?.commentId || !req?.body?.reaction) {
    return res
      .status(400)
      .json({ error: "User Id, Comment Id and reaction are required" });
  }
  try {
    // Solution 2
    const update = await ReactionC.findOneAndUpdate(
      { userId: req.body.userId, commentId: req.body.commentId }, //filter
      { reaction: req.body.reaction }
    );

    if (!update) {
      // console.log("update error :", update);
      return res.status(400).json({
        error: "No reaction found",
      });
    } else {
      // console.log("update ok:", update);
      res.status(200).json({
        msg: "Reaction updated",
      });
    }
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

exports.removeReaction = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.commentId) {
      return res.status(400).json({ error: "userId ? commentId ?" });
    }

    // Solution 2
    // Start Solution 2
    const findReaction = await ReactionC.findOne({
      userId: req.body.userId,
      commentId: req.body.commentId,
    });

    if (!findReaction) {
      return res.status(400).json({
        error: "No reaction found",
      });
    } else {
      // console.log("findReaction", findReaction);
      let reactionId = findReaction._id;
      const comment = await Comment.findOneAndUpdate(
        { _id: req.body.commentId }, //filter
        { $pull: { reactions: reactionId } }, //update //option
        { new: true }
      );

      if (!comment) {
        return res.status(400).json({
          error: "Error when removing reaction id from comment list",
        });
      } else {
        const reaction = await ReactionC.deleteOne({ _id: reactionId });

        if (!reaction) {
          res.status(400).json({
            error: "Error when removing reaction id from reaction list",
          });
        } else {
          res.status(200).json({
            msg: "reaction removed",
          });
        }
      }
    }
    // End solution 2
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};
