import { Router } from "express";
import {
  createShipment,
  getShipment,
  updateShipment,
  deleteShipment,
  getShipmentStats,
  getShipmentDetails
} from "../controllers/shipment.controller.js";
import { verify } from "../middleware/auth.middleware.js";

const router = Router();

// 1) Create a shipment
//    POST /shipment
router.post("/shipment", verify, createShipment);

// 2) CRUD for single shipments
router.get   ("/shipment/:id", verify, getShipment);
router.put   ("/shipment/:id", verify, updateShipment);
router.delete("/shipment/:id", verify, deleteShipment);

// 3) Stats endpoint
//    GET /shipment
router.get("/shipment", verify, getShipmentStats);

// 4) Paginated details
//    GET /shipmentDetails
router.get("/shipmentDetails", verify, getShipmentDetails);

export default router;