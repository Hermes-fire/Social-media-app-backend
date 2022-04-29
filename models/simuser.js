const mongoose = require('mongoose')
const { v1: uuidv1} = require('uuid');

//simulate a corporate 

const userSchema = new mongoose.Schema(
   {
       fname: {
           type: String,
           trim: true,
           required: true,
           maxlength: 32
       },
       lname: {
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