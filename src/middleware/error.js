import ErrorResponse from '../utils/ErrorResponse';
// Custom Error Handler, this type of middleware has 4 arguments.
// It will be used for all the catches in the controllers
const errorHandler = (err, req, res, next) => {
  let error = { ...err }; // copying error object
  error.message = err.message;
  // Error handler coming from a request for dev mode
  // console.log('Error stack ', err.stack.red);
  // console.log(err);
  console.log('Error name: '.red.inverse, err.name.red);
  console.log('Error message: '.red.inverse, err.message.red.inverse);
  // console.log('Error value ', err.value);

  // Mongoose bad ObjectId cast error
  if (err.name === 'CastError') {
    const message = `Resource not found with the id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }
  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicated field value entered!';
    error = new ErrorResponse(message, 400);
  }
  // Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(
      (validationErr) => validationErr.message
    );
    error = new ErrorResponse(message, 400);
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;
