const mongoose = require("mongoose");

//simulate corporate database users
const navbarInfoSchema = new mongoose.Schema({
  id: {
    type: String,
    trim: true,
  },
  icon: {
    type: String,
    trim: true,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    trim: true,
  },
  hasLink: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("NavbarInfo", navbarInfoSchema);
