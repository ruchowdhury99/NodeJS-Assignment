import Order from "../models/order.model.js";

/**
 * POST /orders
 * Create a new order.
 * Body: { items: [{itemName, quantity}, ...], status: "Active"|"Inactive", orderDate? }
 */
export async function createOrder(req, res, next) {
  try {
    const { items, status, orderDate } = req.body;
    if (!items || !Array.isArray(items) || !status) {
      return res.status(400).json({ status: 400, message: "items and status are required" });
    }
    const order = await Order.create({
      items,
      status,
      orderDate: orderDate ? new Date(orderDate) : undefined,
      createdBy: req.user.sub
    });
    res.status(201).json({ status: 201, data: order });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /orders
 * List all orders (optionally filter by date range & status)
 */
export async function listOrders(req, res, next) {
  try {
    const { startDate, endDate, status } = req.query;
    const filter = {};
    if (startDate && endDate) {
      filter.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (status) {
      filter.status = status;
    }
    const orders = await Order.find(filter).sort({ orderDate: -1 });
    res.json({ status: 200, data: orders });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /orders/:id
 * Get a single order by ID
 */
export async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ status: 404, message: "Not found" });
    res.json({ status: 200, data: order });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /orders/:id
 * Update an order
 */
export async function updateOrder(req, res, next) {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ status: 200, data: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /orders/:id
 */
export async function deleteOrder(req, res, next) {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

/**
 * GET /orders/stats
 * Query parameters: startDate, endDate
 * Returns counts of Active vs Inactive in the date range.
 */
// export async function getOrdersStats(req, res, next) {
//   try {
//     const { startDate, endDate } = req.query;
//     if (!startDate || !endDate) {
//       return res.status(400).json({ status: 400, message: "startDate and endDate are required" });
//     }
//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     const agg = await Order.aggregate([
//       { $match: { orderDate: { $gte: start, $lte: end } } },
//       { $group: { _id: "$status", count: { $sum: 1 } } }
//     ]);

//     const stats = { Active: 0, Inactive: 0 };
//     agg.forEach(({ _id, count }) => { stats[_id] = count; });

//     res.json({ status: 200, data: { orders: stats } });
//   } catch (err) {
//     next(err);
//   }
// }

export async function getOrdersStats(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ status: 400, message: "startDate and endDate are required" });
      }
  
      const start = new Date(startDate);
      const end   = new Date(endDate);
      // extend end to include the entire day
      end.setHours(23, 59, 59, 999);
  
      // --- DEBUG: see how many match ---
      // const matched = await Order.find({ orderDate: { $gte: start, $lte: end } });
      // console.log("Matched orders count:", matched.length);
  
      const agg = await Order.aggregate([
        { $match: { orderDate: { $gte: start, $lte: end } } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);
  
      const stats = { Active: 0, Inactive: 0 };
      agg.forEach(({ _id, count }) => { stats[_id] = count; });
  
      return res.json({ status: 200, data: { orders: stats } });
    } catch (err) {
      next(err);
    }
  }
