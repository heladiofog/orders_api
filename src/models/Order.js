import mongoose, { Schema } from 'mongoose';

// Products only for the orders (there is no relation to a catalog)
const ProductSchema = Schema({
  name: {
    type: String,
    required: true,
  },
  unitaryPrice: {
    type: Number,
    default: 0.0,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const OrderSchema = mongoose.Schema(
  {
    // The user that created the order
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    externalClient: {
      type: String,
      required: true,
    },
    totalPrice: {
      // this must be calculated next
      type: Number,
      required: true,
    },
    products: {
      type: [ProductSchema],
    },
  },
  {
    collection: 'Orders',
    timestamps: true,
  }
);

export default mongoose.model('Order', OrderSchema);
