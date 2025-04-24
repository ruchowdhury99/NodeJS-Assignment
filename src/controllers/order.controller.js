
//-------------------------------------ORDER CONTROLLERS---------------------------------------//

// 1. Creating a new order
// 2. Getting all orders
// 3. Getting a single order by ID
// 4. Updating an order
// 5. Deleting an order
// 6. Getting the orders stats

import Order from "../models/order.model.js";


 // 1. Creating a new order

 //  POST - {baseurl}/orders


export async function createOrder(req, res, next) {
  try {

    // Validating the request body

    const { items, status, orderDate } = req.body;
    if (!items || !Array.isArray(items) || !status) {
      return res.status(400).json({ status: 400, message: "Items and status are required" });
    }

    // Creating the new order

    const order = await Order.create({
      items,
      status,
      orderDate: orderDate ? new Date(orderDate) : undefined,
      createdBy: req.user.sub
    });

    // Returning the created order

    res.status(201).json({ status: 201, data: order });
  } catch (err) {
    next(err);
  }
}

 // 2. Getting all orders
 
 //  GET - {baseurl}/orders

export async function listOrders(req, res, next) {
  try {
    const { startDate, endDate, status } = req.query;
    const filter = {};

    // Filtering orders based optional start date and end date

    if (startDate && endDate) {
      filter.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (status) {
      filter.status = status;
    }

    // Getting all orders based on the filter (if any)
    // Results are sorted by orderDate in descending order

    const orders = await Order.find(filter).sort({ orderDate: -1 });
    res.json({ status: 200, data: orders });
  } catch (err) {
    next(err);
  }
}

 // 3. Getting a single order by ID

 //  GET - {baseurl}/orders/:id
 
export async function getOrder(req, res, next) {
  try {

    // Finding the order by ID
    // Return 404 if not found

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ status: 404, message: "Not found" });

    // Returning the found order

    res.json({ status: 200, data: order });
  } catch (err) {
    next(err);
  }
}

// 4. Updating an order

// PUT - {baseurl}/orders/:id

export async function updateOrder(req, res, next) {
  try {

    // Finding the order by ID and updating the specified fields

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    // Returning the updated order

    res.json({ status: 200, data: updated });
  } catch (err) {
    next(err);
  }
}

// 5. Deleting an order by ID

// DELETE - {baseurl}/orders/:id

export async function deleteOrder(req, res, next) {
  try {

    // Finding and deleting the order by ID

    await Order.findByIdAndDelete(req.params.id);
    
    
    return res.status(204).json({
        status: 204,
        message: "Order deleted successfully"
    });
  } catch (err) {
    next(err);
  }
}

// 6. Getting the orders stats
// GET - {baseurl}/orders/stats


export async function getOrdersStats(req, res, next) {
    try {

      // Get the start and end dates from the query string parameters.

      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ status: 400, message: "StartDate and EndDate are required" });
      }
  
      const start = new Date(startDate);
      const end   = new Date(endDate);

      // extend end to include the entire day
      // sets the hours, minutes, seconds, and milliseconds for a Date object
      end.setHours(23, 59, 59, 999);
  
      
      // Aggregating the orders by status within the given date range.
  
      const agg = await Order.aggregate([
        { $match: { orderDate: { $gte: start, $lte: end } } },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]);
  
      // Initialize the stats object with zero counts for both active and inactive orders.
      
      const stats = { Active: 0, Inactive: 0 };
      agg.forEach(({ _id, count }) => { stats[_id] = count; });
      

      // Return the stats object with the counts of active and inactive orders.

      return res.json({ status: 200, data: { orders: stats } });
    } catch (err) {
      next(err);
    }
  }


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
