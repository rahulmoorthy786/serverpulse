const errorHandler = (error, req, res, _next) => {
  console.error(error);

  res.status(500).json({
    success: false,
    message: "An unexpected server error occurred",
  });
};

module.exports = errorHandler;
