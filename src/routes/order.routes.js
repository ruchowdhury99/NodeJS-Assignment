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

// 1) Stats endpoint must come *before* any "/orders/:id" route
// GET /orders/stats?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
router.get("/orders/stats", verify, getOrdersStats);

// 2) CRUD endpoints
router.post("/orders",         verify, createOrder);
router.get("/orders",          verify, listOrders);
router.get("/orders/:id",      verify, getOrder);
router.put("/orders/:id",      verify, updateOrder);
router.delete("/orders/:id",   verify, deleteOrder);

export default router;