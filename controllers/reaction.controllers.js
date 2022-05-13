const Reaction = require("../models/reaction");

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