
//------------------------------------SHIPMENT API ROUTES------------------------------------//

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

// To create a shipment
router.post("/shipment", verify, createShipment);

// To get shipment statistics
router.get("/shipment", verify, getShipmentStats);

// To get shipment details
router.get("/shipmentDetails", verify, getShipmentDetails);

// To get a specific shipment
router.get   ("/shipment/:id", verify, getShipment);

// To update a specific shipment
router.put   ("/shipment/:id", verify, updateShipment);

// To delete a specific shipment
router.delete("/shipment/:id", verify, deleteShipment);



export default router;