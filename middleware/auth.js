const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.authenticateUser = async (req, res, next) => {
  const accessToken = req.body["access-token"];
  const userId = req.body["user-id"];
  let user;

  if (!(userId && accessToken)) {
    const error = new Error("Please provide a valid user-id and access token.");
    error.statusCode = 400;
    return next(error);
  }

  try {
    user = await User.findOne({
      _id: userId,
    });
  } catch (e) {
    const error = new Error("Invalid user-id.");
    error.statusCode = 500;
    return next(error);
  }

  jwt.verify(accessToken, process.env.TOKEN_SECRET, (err) => {
    if (err) {
      const error = new Error("Invalid access-token.");
      error.statusCode = 400;
      return next(error);
    }

    req.user = user;
    next();
  });
};
