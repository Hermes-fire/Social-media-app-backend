const Reply = require('../models/reply')

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
