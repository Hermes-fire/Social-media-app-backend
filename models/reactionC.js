const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionCSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    postId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    commentId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    reaction: {
        type: String,
        enum: ['like', 'love', 'wow', 'haha', 'sad', 'angry'],
        required: true,
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("ReactionC", reactionCSchema);
