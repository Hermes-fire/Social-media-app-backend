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
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
    { timestamps: true }
});

module.exports = mongoose.model("Reaction", reactionSchema);

