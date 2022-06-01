const Reaction = require("../models/reaction");
const Announcement = require("../models/announcement");

exports.create = async (req, res) => {
  const reaction = new Reaction(req.body);
  reaction.userId = req.id;
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
  reaction.userId = req.id;
  try {
    //add this check - ( user can have only one reaction)
    // find reaction with postId and userId
    // If exist return "user already reacted to this post"
    const result = await reaction.save();
    const announcement = await Announcement.findOneAndUpdate(
      { _id: result.postId }, //filter
      { $push: { reactions: result._id } }, //update
      { new: true } //option
    );
    res.status(201).json({ result, announcement });
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

exports.getReactionById = (req, res, next, id) => {
  Reaction.findById(id).exec((err, reaction) => {
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

exports.updateReaction_old = async (req, res) => {
  const reaction = new Reaction(req.reaction);
  if (!req.body.reaction) {
    return res.status(400).json({
      error: "please specify a reaction",
    });
  }
  //check if user own comment
  if (req.id != req.reaction.userId) {
    return res.status(403).json({
      error: "unauthorized",
    });
  }
  try {
    await reaction.updateOne({ reaction: req.body.reaction });
    return res.json({
      msg: "updated",
    });
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

exports.updateReaction = async (req, res) => {
  if (!req?.body?.userId || !req?.body?.postId || !req?.body?.reaction) {
    return res
      .status(400)
      .json({ error: "User Id, Post Id and reaction are required" });
  }
  try {
    // Solution 2
    const update = await Reaction.findOneAndUpdate(
      { userId: req.body.userId, postId: req.body.postId }, //filter
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

exports.removeReaction_old = async (req, res) => {
  if (req.id != req.reaction.userId) {
    return res.status(403).json({
      error: "unauthorized",
    });
  }
  try {
    const announcement = await Announcement.findOneAndUpdate(
      { _id: req.reaction.postId }, //filter
      { $pull: { reactions: req.reaction._id } }, //update
      { new: true } //option
    );
    await Reaction.deleteOne({ _id: req.reaction._id });
    return res.status(200).json({
      msg: "removed",
      announcement: announcement,
    });
  } catch (err) {
    return res.status(400).json({
      error: err,
    });
  }
};

exports.removeReaction = async (req, res) => {
  try {
    if (!req.body.userId || !req.body.postId) {
      return res.status(400).json({ error: "userId ? postId ?" });
    }

    // Solution 2
    // Start Solution 2
    const findReaction = await Reaction.findOne({
      userId: req.body.userId,
      postId: req.body.postId,
    });

    if (!findReaction) {
      return res.status(400).json({
        error: "No reaction found",
      });
    } else {
      // console.log("findReaction", findReaction);
      let reactionId = findReaction._id;
      const announcement = await Announcement.findOneAndUpdate(
        { _id: req.body.postId }, //filter
        { $pull: { reactions: reactionId } }, //update //option
        { new: true }
      );

      if (!announcement) {
        return res.status(400).json({
          error: "Error when removing reaction id from announcement list",
        });
      } else {
        const reaction = await Reaction.deleteOne({ _id: reactionId });

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
