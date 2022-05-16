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
    reactionType: {
        type: String,
        enum: ['like', 'love', 'wow', 'haha', 'sad', 'angry'],
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("Reaction", reactionSchema);

