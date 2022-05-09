exports.signupErrorHandler = (error) => {
  switch (error.code) {
    case 11000:
      if (error.keyPattern._id) {
        return "user already signed up";
      }
      break;
    default:
      return "something went wrong";
  }
  return error;
};

/**
 * Get the erroror message from error object
 */
exports.errorHandler = (error) => {
  let message = "";

  if (error.code) {
    switch (error.code) {
      //   case 11000:
      case 11001:
        message = uniqueMessage(error);
        break;
      default:
        message = "Something went wrong";
    }
  } else {
    for (let errorName in error.errorors) {
      if (error.errorors[errorName].message)
        message = error.errorors[errorName].message;
    }
  }

  return message;
};
