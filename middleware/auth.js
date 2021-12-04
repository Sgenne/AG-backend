const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.authenticateUser = async (req, res, next) => {
  let accessToken = req.header("Authorization");
  const userId = req.header("UserId");
  let user;

  if (!(userId && accessToken)) {
    console.log("user-id: ", userId);
    console.log("access-token: ", accessToken);
    const error = new Error(
      `Please provide a valid user-id and access token. 
      Provide the user-id under header "userId", and the access-token under header "Authorization" as "Bearer: <token>".`
    );
    error.statusCode = 400;
    return next(error);
  }

  accessToken = accessToken.split(" ")[1];

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
