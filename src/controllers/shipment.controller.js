
//-------------------------------SHIPMENT CONTROLLER-------------------------------//

// 1. Create a new shipment record.
// 2. Get the shipment record by shipmentId.
// 3. Update the shipment record.
// 4. Delete the shipment record by shipmentId.
// 5. Get all shipment records.
// 6. Get shipment details with optional filters.

import Shipment from "../models/shipment.model.js";

// 1. Create a new shipment record

// POST - {baseurl}/shipment

 
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
  
      // Check the validation of required fields

      for (let field of ["shipmentId","productId","productName","quantity","price","deliveryDate","shipmentDestination","shipmentStatus"]) {
        if (!req.body[field]) {
          return res.status(400).json({ status: 400, message: `${field} is required` });
        }
      }
  

      // Create a new shipment record and save it to the database

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

  // 2. Get the shipment record by shipmentId

  // GET - {baseurl}/shipment/:id

export async function getShipment(req, res, next) {
  try {

    // Fetch the shipmentId from the request parameter

    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ status:404, message:"Shipment not found" });
    }

    // Return the fetched shipment record

    return res.json({ status:200, data: shipment });
  } catch (err) {
    next(err);
  }
}

// 3. Update the shipment record

// PUT - {baseurl}/shipment/:id


export async function updateShipment(req, res, next) {
  try {

    // Fetch the shipmentId from the request parameter

    const updated = await Shipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Check if the shipment was updated

    if (!updated) {
      return res.status(404).json({ status:404, message:"Shipment not found" });
    }

    // Return the updated shipment record

    return res.json({ status:200, data: updated });
  } catch (err) {
    next(err);
  }
}

// 4. Delete the shipment record by shipmentId  

// DELETE - {baseurl}/shipment/:id

export async function deleteShipment(req, res, next) {
  try {

    // Fetch the shipmentId to be deleted from the request parameter

    const deleted = await Shipment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ status:404, message:"Shipment not found" });
    }


    //return res.status(204).end();
    
    return res.status(200).json({
        status: 200,
        message: "Shipment deleted successfully"
    });
  } catch (err) {
    next(err);
  }
}

// 5. Get overall shipment statistics

// GET - {baseurl}/shipment


export async function getShipmentStats(req, res, next) {
  try {

    // Aggregate shipment records by status and count them
    // and return the result as JSON

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


// 6. Get shipment details with optional filters and pagination

// GET - {baseurl}/shipmentDetails

export async function getShipmentDetails(req, res, next) {
  try {

    // Parse query parameters and applying filters
    // Pagination parameters are applied to limit the number of shipments returned per page
    // and offset the number of shipments to skip based on the page number and offset.

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
