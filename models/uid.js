const mongoose = require('mongoose')
const { v1: uuidv1} = require('uuid');


const userSchema = new mongoose.Schema(
   {
       name: {
           type: String,
           trim: true,
           required: true,
           maxlength: 64
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

module.exports = mongoose.model("Uuid", userSchema)