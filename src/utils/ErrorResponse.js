// Create a neater error handler through a class
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
// module.exports = ErrorResponse;  // replaced by es6
export default ErrorResponse;
