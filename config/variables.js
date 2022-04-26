require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
const PORT = process.env.PORT;

module.exports = {
  MONGO_URI,
  JWT_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
  PORT,
};
