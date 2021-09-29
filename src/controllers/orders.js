import OrderModel from '../models/Order';
import asyncHandler from '../middleware/async';
import ErrorResponse from '../utils/ErrorResponse';

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Public
export const getOrders = asyncHandler(async (req, res, next) => {
  let query;

  // Copying req.query
  const reqQuery = { ...req.query };

  // Field to exclude in the case of selecting fields to be shown
  const removeFields = ['select'];

  // Loop over to removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);
  console.log('[reqQuery] ', reqQuery);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Replace the query string, for adding the Mongo's '$' operator ($gt, $lt, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding Resource
  query = OrderModel.find(JSON.parse(queryStr));
  console.log('[queryStr] ', queryStr);
  // Selected fields being formatted for filtering
  if (req.query.select) {
    const selectedFields = req.query.select.split(',').join(' ');
    // console.log(selectedFields);
    query = query.select(selectedFields).lean();
  }

  // Executing query
  const orders = await query;

  res.status(200).json({
    success: true,
    message: 'Show all orders',
    count: orders.length,
    data: orders,
  });
});

// @desc    Get Report of sold products
// @route   GET /api/v1/orders
// @access  Private, only for authorized users
export const getSoldProducts = asyncHandler(async (req, res, next) => {
  let query;
  // Getting query params for filtering
  const { startDate, endDate } = req.query;
  // console.log('[startDate, endDate] ', startDate, endDate);
  // Check if any of the filter params is missing
  if (!!startDate === false || !!endDate === false) {
    return next(
      new ErrorResponse(
        `Start Date and End Date are required for the report.`,
        400
      )
    );
  }

  // Date limits with hours to be precise
  query = OrderModel.find({
    createdAt: {
      $gte: new Date(new Date(startDate).setHours(0, 0, 0)),
      $lt: new Date(new Date(endDate).setHours(23, 59, 59)),
    },
  })
    .select('products')
    .lean(); // In order to be lighter...

  // Finding Resource
  const orders = await query;
  // console.log(orders);
  // 1. Get products together, group by name and do some calcs
  let products = [];
  // for...of for collections
  for (const order of orders) {
    products = [...products, ...Array.from(order.products)];
  }
  // 2. Group by product's name
  // This will be an object with each product name as field (key)
  const groupedProductsObject = groupProductsBy(products, 'name');
  // 3. List of grouped products within an array
  const groupedProducts = [];
  // for...in for enum props of objects...
  for (const prodName in groupedProductsObject) {
    groupedProducts.push({
      name: prodName,
      totalAmount: groupedProductsObject[prodName].totalAmount,
      totalQuantity: groupedProductsObject[prodName].totalQuantity,
    });
  }

  // console.log('[groupedProducts] (unordered)', groupedProducts);
  // get sorted products at the very end...

  res.status(200).json({
    success: true,
    message: 'Sold Products Report',
    count: groupedProducts.length,
    data: groupedProducts.sort((a, b) => b.totalQuantity - a.totalQuantity),
  });
});

/**
 *  It groups a list of products by the required property
 * @param {Array} products Array of products
 * @param {String} property Name of the property to group for
 * @returns An object of grouped products by property
 * TO DO: get into a utility independent module
 */
const groupProductsBy = (products = [], property = 'name') => {
  return products.reduce((groupedProds, product) => {
    let key = product[property]; // the object key to look for...
    // If the product isn't already grouped...it is created
    if (!groupedProds[key]) {
      // groupedProds[key] = [];  // base case
      groupedProds[key] = {
        totalAmount: 0,
        totalQuantity: 0,
      };
    }
    // Update the product with price and qty
    // groupedProds[key].push(product); // base case
    groupedProds[key] = {
      totalAmount:
        groupedProds[key]['totalAmount'] +
        product['unitaryPrice'] * product['quantity'],
      totalQuantity: groupedProds[key]['totalQuantity'] + product['quantity'],
    };
    // return grouped products object
    return groupedProds;
  }, {});
};

// @desc    Get a single order by Id
// @route   GET /api/v1/orders/:id
// @access  Public
export const getOrderById = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id);
  // When an order is not in DB
  if (!order) {
    // return in order to avoid the error: "Cannot set headers after they are sent to the client"
    return next(
      new ErrorResponse(
        `Order was not found with the id of ${req.params.id}`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    message: `Showing order ${req.params.id}`,
    data: order,
  });
});

// @desc    Create an order
// @route   POST /api/v1/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.create(req.body);

  res.status(201).json({
    success: true,
    message: `Order was created!`,
    data: order,
  });
});

// @desc    Update an order
// @route   PUT /api/v1/orders/:id
// @access  Private
export const updateOrder = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // Validate that the order exists
  if (!order) {
    return next(
      new ErrorResponse(`Order not found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: order,
    message: `Successfully Updated Order: ${req.params.id}`,
  });
});

// @desc    Delete an order
// @route   DELETE /api/v1/orders/:id
// @access  Private
export const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await OrderModel.findByIdAndDelete(req.params.id);
  // Validate that the order existed
  if (!order) {
    return next(
      new ErrorResponse(`Order not found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: `Deleted order: ${req.params.id}`,
    data: {},
  });
});
