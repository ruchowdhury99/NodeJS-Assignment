import Shipment from "../models/shipment.model.js";

/**
 * POST /shipment
 * Create a new shipment record.
 * Body:
 * {
 *   shipmentId,
 *   product,         // ObjectId of Product
 *   productName,
 *   supplierId,      // ObjectId of Supplier
 *   supplierName,
 *   quantity,
 *   price,
 *   deliveryDate,    // ISO date string or Date
 *   shipperId,       // ObjectId of Shipper
 *   shipperName,
 *   shipmentDestination,
 *   shipmentStatus,  // Completed | In-Transit | Pending | Failed
 *   lat,
 *   long
 * }
 */
export async function createShipment(req, res, next) {
    try {
      const {
        shipmentId,
        productId,
        productName,
        supplierId,
        supplierName,
        quantity,
        price,
        deliveryDate,
        shipperId,
        shipperName,
        shipmentDestination,
        shipmentStatus,
        lat,
        long
      } = req.body;
  
      // Validate required fields
      for (let field of ["shipmentId","productId","productName","quantity","price","deliveryDate","shipmentDestination","shipmentStatus"]) {
        if (!req.body[field]) {
          return res.status(400).json({ status: 400, message: `${field} is required` });
        }
      }
  
      const shipment = await Shipment.create({
        shipmentId,
        productId,
        productName,
        supplierId,
        supplierName,
        quantity,
        price,
        deliveryDate,
        shipperId,
        shipperName,
        shipmentDestination,
        shipmentStatus,
        lat,
        long
      });
      return res.status(201).json({ status: 201, data: shipment });
    } catch (err) {
      next(err);
    }
  }

/**
 * GET /shipment/:id
 * Fetch a single shipment by its Mongo ID.
 */
export async function getShipment(req, res, next) {
  try {
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ status:404, message:"Shipment not found" });
    }
    return res.json({ status:200, data: shipment });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /shipment/:id
 * Update an existing shipment.
 * Body: any updatable fields (same as create).
 */
export async function updateShipment(req, res, next) {
  try {
    const updated = await Shipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ status:404, message:"Shipment not found" });
    }
    return res.json({ status:200, data: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /shipment/:id
 * Remove a shipment.
 */
export async function deleteShipment(req, res, next) {
  try {
    const deleted = await Shipment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status:404, message:"Shipment not found" });
    }
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
}

/**
 * GET /shipment
 * Overall shipment stats: Total + per-status counts.
 */
export async function getShipmentStats(req, res, next) {
  try {
    const agg = await Shipment.aggregate([
      { $group: { _id: "$shipmentStatus", count: { $sum: 1 } } }
    ]);
    const stats = {
      Total: 0,
      Completed: 0,
      "In-Transit": 0,
      Pending: 0,
      Failed: 0
    };
    agg.forEach(({ _id, count }) => {
      stats[_id] = count;
      stats.Total += count;
    });
    return res.json({ status:200, data: stats });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /shipmentDetails
 * Paginated shipment list with optional status filter.
 * Query:
 *   pageNumber (default 1),
 *   offset     (default 10),
 *   status     (exact or case-insensitive match)
 */
export async function getShipmentDetails(req, res, next) {
  try {
    let { pageNumber = 1, offset = 10, status } = req.query;
    pageNumber = parseInt(pageNumber);
    offset     = parseInt(offset);

    const filter = {};
    if (status) {
      filter.shipmentStatus = new RegExp(`^${status}$`, "i");
    }

    const total = await Shipment.countDocuments(filter);
    const shipments = await Shipment.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * offset)
      .limit(offset)
      .select("-__v");

    return res.json({
      status: 200,
      data: {
        pageNumber,
        offset,
        totalRecords: total,
        shipments
      }
    });
  } catch (err) {
    next(err);
  }
}
