// import dotenv from 'dotenv';
// import express from 'express';
// import mongoose from 'mongoose';
// import authRoutes from './routes/auth.routes.js';

// dotenv.config();


// const app = express();

// app.use(express.json());

// app.use('/' , authRoutes);

// app.use((err, req, res, next) => {

//   console.error(err);

//   res.status(err.status || 500).json({
//     status: err.status || 500,
//     message: err.message || 'Internal Server Error',
//   });

// });


// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log('MongoDB Connected...');
//     app.listen(process.env.PORT || 3000, () => {
//       console.log(`Server running on port ${process.env.PORT}` || 3000);
//     });
//   })
//   .catch(err => console.log("DB connection error", err));


import express from 'express';
import mongoose from 'mongoose';

import { MONGO_URI, PORT } from './config.js';
import authRoutes      from './routes/auth.routes.js';
// import errorHandler    from './utils/errorHandler.js';
import orderRoutes      from './routes/order.routes.js';
import shipmentRoutes from './routes/shipment.routes.js';
import productRoutes from './routes/product.routes.js';

const app = express();
app.use(express.json());

// Routes
app.use('/', authRoutes);
// ...

app.use("/", orderRoutes);
app.use("/", shipmentRoutes);
app.use("/", productRoutes);



// Error handler
// app.use(errorHandler);

// Connect & run
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  });