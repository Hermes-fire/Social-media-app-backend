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