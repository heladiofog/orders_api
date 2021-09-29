import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getSoldProducts,
} from '../controllers/orders';
import { loginRequired } from '../middleware/auth';

const router = express.Router();

// Use controller methods for Orders' endpoints
// @Endpoint    /orders/
router
  .route('/')
  .get(loginRequired, getOrders)
  .post(loginRequired, createOrder);

// @Endpoint    /orders/:id
router
  .route('/:id')
  .get(loginRequired, getOrderById)
  .put(loginRequired, updateOrder)
  .delete(loginRequired, deleteOrder);

// Reports for Parrot
router.route('/reports/sold-products').get(getSoldProducts);

export default router;
