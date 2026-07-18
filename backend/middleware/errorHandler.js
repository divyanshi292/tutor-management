const errorHandler = (error, req, res, next) => {
  void req;
  void next;

  console.error(error);

  const status =
    error.name === "ValidationError" || error.name === "CastError"
      ? 400
      : 500;

  res.status(status).json({
    message:
      status === 500 ? "An unexpected server error occurred" : error.message,
  });
};

module.exports = errorHandler;
