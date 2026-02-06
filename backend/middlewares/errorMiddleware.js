import logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  logger.error(
    {
      method: req.method,
      url: req.originalUrl,
      stack: err.stack
    },
    err.message
  );

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Something went wrong. Please try again later."
        : err.message
  });
};

export default errorHandler;
