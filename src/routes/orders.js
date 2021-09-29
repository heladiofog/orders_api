import express from 'express';
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getSoldProducts,
} from '../controllers/orders';
const router = express.Router();

// Use controller methods for Orders' endpoints
// @Endpoint    /orders/
router.route('/').get(getOrders).post(createOrder);

// @Endpoint    /orders/:id
router.route('/:id').get(getOrderById).put(updateOrder).delete(deleteOrder);

// Reports for Parrot
router.route('/reports/sold-products').get(getSoldProducts);

export default router;
