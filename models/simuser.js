const mongoose = require('mongoose')

//simulate corporate database users
const userSchema = new mongoose.Schema(
   {
       name: {
           type: String,
           trim: true,
           required: true,
           maxlength: 32
       },
       email: {
           type: String,
           trim: true,
           required: true,
           unique: true
       },
   },
   { timestamps: true }
);

module.exports = mongoose.model("SimUser", userSchema)