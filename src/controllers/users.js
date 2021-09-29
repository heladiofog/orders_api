import UserModel from '../models/User';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/ErrorResponse';
import jwt from 'jsonwebtoken';

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
export const getUsers = asyncHandler(async (req, res, next) => {
  let query;
  // replace the query operators for filtering
  let queryStr = JSON.stringify(req.query);
  // Replace the query string, for adding the Mongo's '$' operator
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  console.log('GetAllUsers -> [query, queryStr] ', req.query, queryStr);
  // Setting the query and then execute it
  query = UserModel.find(JSON.parse(queryStr));
  // query = UserModel.find();

  const users = await query;

  res.status(200).json({
    success: true,
    message: 'Show all users',
    count: users.length,
    data: users,
  });
});

// @desc    Get a single user by Id
// @route   GET /api/v1/users/:id
// @access  Public
export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.params.id);
  // When an user is not in DB
  if (!user) {
    // return in order to avoid the error: "Cannot set headers after they are sent to the client"
    return next(
      new ErrorResponse(
        `User was not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    message: `Showing user ${req.params.id}`,
    data: user,
  });
});

// @desc    Create a user
// @route   POST /api/v1/users
// @access  Private
export const createUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.create(req.body);
  user.password = undefined; // remove hashed password info

  res.status(201).json({
    success: true,
    message: `User was created!`,
    data: user,
  });
});

// @desc    Update a user
// @route   PUT /api/v1/users/:id
// @access  Private
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // Validate that the user exists
  if (!user) {
    return next(
      new ErrorResponse(`User not found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
    message: `Successfully Updated User: ${req.params.id}`,
  });
});

// @desc    Delete a user
// @route   DELETE /api/v1/users/:id
// @access  Private
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  // Validate that the user existed
  if (!user) {
    return next(
      new ErrorResponse(
        `User was not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    message: `Deleted user: ${req.params.id}`,
    data: {},
  });
});

// @desc    Authenticate a user
// @route   DELETE /api/v1/users/:id
// @access  Private

export const login = asyncHandler(async (req, res, next) => {
  UserModel.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return next(
        new ErrorResponse(`There was an error with authentication.`, 500)
      );
    }
    // Validate that the user existed
    if (!user) {
      return next(
        new ErrorResponse(`Authentication failed. No user found.`, 404)
      );
    } else if (user) {
      if (!user.comparePassword(req.body.password, user.password)) {
        console.log(`Wrong password...`);
        return next(
          new ErrorResponse(`'Authentication failed. Wrong credentials.`, 401)
        );
      } else {
        let secret = process.env.SECRET_KEY || 'S3cuRe$';

        return res.status(200).json({
          success: true,
          token: jwt.sign(
            {
              email: user.email,
              name: user.name,
              _id: user.id,
            },
            secret,
            { expiresIn: 3600 }
          ),
        });
      }
    }
  });
});
