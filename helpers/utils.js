const { v1: uuidv1 } = require("uuid");
const crypto = require("crypto");

exports.encryptNewPassword = (password) => {
  let salt = uuidv1();
  return {
    hashedNewPassword: crypto
      .createHmac("sha1", salt)
      .update(password)
      .digest("hex"),
    salt,
  };
};
