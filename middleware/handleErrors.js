exports.handleErrors = (error, req, res, next) => {
  const message = error.message;
  const statusCode = error.statusCode ? error.statusCode : 500;
  res.status(statusCode).json(
    JSON.stringify({
      message: message,
    })
  );
};

exports.handle404 = (req, res, next) => {
  res.status(404).json({
    message: "Invalid URL."
  });
}