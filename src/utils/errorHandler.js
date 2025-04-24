import AppError from './AppError.js';

export default function errorHandler(err, req, res, next) {
  // If it's not an AppError, wrap it (500 Internal Server Error)
  if (!(err instanceof AppError)) {
    console.error('🔥 Unexpected Error:', err);
    err = new AppError(500, 'Internal Server Error', false);
  }

  const { statusCode, message, isOperational } = err;

  // Send only operational error messages to client
  res.status(statusCode).json({
    status: statusCode,
    message: isOperational ? message : 'Something went wrong'
  });
}
