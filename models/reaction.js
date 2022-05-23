//Reaction models for post reaction
//ReactionC models for comment reaction
////ReactionR models for reply reaction

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    postId: {
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

module.exports = mongoose.model("Reaction", reactionSchema);

