const mongoose = require('mongoose')
const crypto = require('crypto')
const { v1: uuidv1} = require('uuid');


const userSchema = new mongoose.Schema(
   {
        _id: {
            type: String,
            maxlength: 32,
        },
       name: {
           type: String,
           trim: true,
           required: true,
           maxlength: 32
       },
       surname: {
        type: String,
        trim: true,
       },//here
       email: {
           type: String,
           trim: true,
           required: true,
           unique: true
       },
       hashed_password: {
           type: String,
           required: true
       },
       salt: String,
       verified: {
        type: Boolean,
        default: false,
      },
   },
   { timestamps: true , _id: false }
);

// virtual field
userSchema
   .virtual('password')
   .set(function(password) {
       this._password = password;
       this.salt = uuidv1();
       this.hashed_password = this.encryptPassword(password);
   })
   .get(function() {
       return this._password;
   });

userSchema.methods = {
   authenticate: function(plaintext) {
       return this.encryptPassword(plaintext) === this.hashed_password 
   },
   encryptPassword: function(password) {
       if (!password) return '';
       try {
           return crypto
               .createHmac('sha1', this.salt)
               .update(password)
               .digest('hex');
       } catch (err) {
           return '';
       }
   }
};

module.exports = mongoose.model("User", userSchema)