const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
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
    comment: {
        type: String,
        maxlength: 1000,
        required: true,
        trim: true,
    },
});

module.exports = mongoose.model("Comment", commentSchema);

