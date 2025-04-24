
//---------------------------------SERVER SETUP---------------------------------//

// Entry point of the backend application


import express from 'express';
import mongoose from 'mongoose';

import { MONGO_URI, PORT } from './config.js';
import errorHandler from './utils/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import orderRoutes from './routes/order.routes.js';
import shipmentRoutes from './routes/shipment.routes.js';
import productRoutes from './routes/product.routes.js';
import stockRoutes from './routes/stock.routes.js';
import taskRoutes from './routes/task.routes.js';
import blogRoutes from './routes/blog.routes.js';

const app = express();
app.use(express.json());

// Routes
app.use('/', authRoutes);

app.use("/", orderRoutes);
app.use("/", shipmentRoutes);
app.use("/", productRoutes);

app.use("/", stockRoutes);
app.use("/", taskRoutes);

app.use("/", blogRoutes);



// Error handler
 app.use(errorHandler);

// Connecting the database & running the server

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('\n MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`\n Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error(' DB connection error:', err);
    process.exit(1);
  });