
// ----------------------------------------ORDER API ROUTES---------------------------------//

import { Router } from "express";
import {
  createOrder,
  listOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getOrdersStats
} from "../controllers/order.controller.js";
import { verify } from "../middleware/auth.middleware.js";

const router = Router();

// To get the orders stats
router.get("/orders/stats", verify, getOrdersStats);

// To create a new order
router.post("/orders", verify, createOrder);

// To get all orders
router.get("/orders", verify, listOrders);

// To get a single order by ID
router.get("/orders/:id", verify, getOrder);

// To update an order by ID
router.put("/orders/:id", verify, updateOrder);

// To delete an order by ID
router.delete("/orders/:id", verify, deleteOrder);

export default router;