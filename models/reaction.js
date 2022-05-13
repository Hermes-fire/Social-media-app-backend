const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reactionSchema = new Schema({
    userId: {
        type: String,
        maxlength: 32,
        required: true,
    },
    postId: {
        type: String,
        maxlength: 32,
        required: true,
    },
    reactionType: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
    },
});

module.exports = mongoose.model("Reaction", reactionSchema);

