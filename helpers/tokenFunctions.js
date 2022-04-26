const variables = require("../config/variables");
const jwt = require("jsonwebtoken"); //to generate signed token

//  Verify token function
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const accessToken = authHeader.split(" ")[1];

    // verify the token
    jwt.verify(accessToken, variables.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({
          error: "Token is not valid!",
        });
      }

      req.id = user._id;
      next();
    });
  } else {
    return res.status(401).json({
      error: "You are not authenticated",
    });
  }
};

// Generate accesstoken function
exports.generateAccessToken = (id) => {
  return jwt.sign({ _id: id }, variables.JWT_SECRET_KEY, {
    expiresIn: "60s",
  });
};

// Generate refresh token function
exports.generateRefreshToken = (id) => {
  return jwt.sign({ _id: id }, variables.JWT_REFRESH_SECRET_KEY);
};
