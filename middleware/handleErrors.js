const handleErrors = (error, req, res, next) => {
  const message = error.message;
  const statusCode = error.statusCode ? error.statusCode : 500;
  res.status(statusCode).json(
    JSON.stringify({
      message: message,
    })
  );
};

module.exports = handleErrors;
