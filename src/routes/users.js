import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
} from '../controllers/users';
import { loginRequired } from '../middleware/auth';

const router = express.Router();

// Use controller methods for Users' endpoints
// @Endpoint    /users/
router.route('/').get(loginRequired, getUsers).post(createUser);

// @Endpoint    /users/:id
router.route('/:id').get(loginRequired, getUserById); //.put(updateUser).delete(deleteUser);

// @Endpoint    /users/login
router.route('/login').post(login);

export default router;
