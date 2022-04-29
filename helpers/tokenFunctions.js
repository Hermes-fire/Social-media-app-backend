const variables = require("../config/variables");
const jwt = require("jsonwebtoken"); //to generate signed token

// Generate accesstoken function
exports.generateAccessToken = (id) => {
  return jwt.sign({ _id: id }, variables.JWT_SECRET_KEY, {
    expiresIn: "1h",
  });
};

// Generate refresh token function
exports.generateRefreshToken = (id) => {
  return jwt.sign({ _id: id }, variables.JWT_REFRESH_SECRET_KEY);
};
