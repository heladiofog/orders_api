import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users';
const router = express.Router();

// Use controller methods for Users' endpoints
// @Endpoint    /users/
router.route('/').get(getUsers).post(createUser);

// @Endpoint    /users/:id
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

export default router;
