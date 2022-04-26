const variables = require("../config/variables");
const jwt = require("jsonwebtoken"); //to generate signed token

//  Verify token function
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const accessToken = authHeader.split(" ")[1];

    // verify the token
    jwt.verify(accessToken, variables.JWT_SECRET_KEY, (err, user) => {
      console.log("here");
      if (err) {
        return res.status(403).json({
          error: "Token is not valid!",
        });
      }

      console.log("here");

      req.user = user;
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
    expiresIn: "30s",
  });
};

// Generate refresh token function
exports.generateRefreshToken = (id) => {
  return jwt.sign({ _id: id }, variables.JWT_REFRESH_SECRET_KEY);
};
