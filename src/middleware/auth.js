import ErrorResponse from '../utils/ErrorResponse';
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    // console.log('Verifying token!');
    let secret = process.env.SECRET_KEY || 'S3cuRe$';
    jwt.verify(
      req.headers.authorization.split(' ')[1],
      secret,
      (err, decodedToken) => {
        // In case of any error
        if (err) {
          return next(
            new ErrorResponse(
              `Something went wrong with user authentication. Refresh your credentials or log in.`,
              500
            )
          );
        }
        // In order to pass to the protected request handlers
        req.user = decodedToken;
        next();
      }
    );
  } else {
    // console.log('Not verifying token!'.red.inverse);
    req.user = undefined;
    next();
  }
};

// For Verifying if the user is already authenticated
export const loginRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return next(new ErrorResponse(`User has no authorization.`, 401));
  }
};
