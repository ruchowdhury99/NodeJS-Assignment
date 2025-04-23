import Stock from '../models/stock.model.js';

// Create a stock entry
export async function createStock(req, res, next) {
  try {
    const {
      product,
      productName,
      consumerName,
      supplierName,
      dateOfEntry = new Date(),
      quantity,
      price,
      sellingPrice,
      cashier,
      status
    } = req.body;

    // Validate required fields
    const required = [
      'product','productName','consumerName','supplierName',
      'quantity','price','sellingPrice','cashier','status'
    ];
    for (let f of required) {
      if (req.body[f] == null) {
        return res.status(400).json({ status:400, message:`${f} is required` });
      }
    }

    const stock = await Stock.create({
      product, productName, consumerName, supplierName,
      dateOfEntry, quantity, price, sellingPrice, cashier, status
    });
    res.status(201).json({ status:201, data: stock });
  } catch (err) { next(err); }
}

// Paginated, filtered, sorted list for /stockDetails
export async function getStockDetails(req, res, next) {
  try {
    let { pageNumber = 1, offset = 10, status, sortBy = 'dateOfEntry', sortDir = 'desc' } = req.query;
    pageNumber = parseInt(pageNumber);
    offset = parseInt(offset);

    const filter = {};
    if (status) filter.status = new RegExp(`^${status}$`, 'i');

    const totalRecords = await Stock.countDocuments(filter);
    const stocks = await Stock.find(filter)
      .sort({ [sortBy]: sortDir==='asc'?1:-1 })
      .skip((pageNumber-1)*offset)
      .limit(offset)
      .select('-__v');

    const data = stocks.map(s => ({
      productid:     s.product.toString(),
      productName:   s.productName,
      consumerName:  s.consumerName,
      supplierName:  s.supplierName,
      dateOfEntry:   s.dateOfEntry.toISOString().slice(0,10),
      quantity:      s.quantity,
      price:         s.price,
      sellingPrice:  s.sellingPrice,
      cashier:       s.cashier,
      status:        s.status
    }));

    res.json({
      status:200,
      data: { pageNumber, offset, totalRecords, stock: data }
    });
  } catch (err) { next(err); }
}
