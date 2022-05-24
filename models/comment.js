const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    comment: {
        type: String,
        maxlength: 1000,
        required: true,
        trim: true,
    },
    reactions: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReactionC'
    }],
    replies: [{
        type: Schema.Types.ObjectId,
        ref: "Reply",
    }]
},
{ timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);

