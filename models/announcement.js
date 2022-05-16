const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//simulate corporate database users
const announcementSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    anDescription: {
      type: String,
      trim: true,
      required: true,
    },
    imgUrl: {
      type: String,
      trim: true,
    },
    anIsAnonymous: {
      type: Boolean,
      default: false,
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }],
    reactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reaction'
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
