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
    { timestamps: true }
});

module.exports = mongoose.model("Comment", commentSchema);

