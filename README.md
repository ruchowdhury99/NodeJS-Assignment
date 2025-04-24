Grocery Store Management System Backend

A comprehensive Node.js & Express.js REST API for managing all aspects of a grocery store's operations, from user authentication to inventory insights.

📖 Project Overview

This backend supports:

User Management: Manager registration, login, logout, and profile retrieval.

Product Catalog: Add, view, update, and remove products with unique SKUs.

Order Processing: Create orders, track their status, and gather activity statistics.

Shipment Tracking: Manage shipment entries, view overall and per-item shipment status, and track locations.

Stock Control: Record stock movements, audit history, and detailed inventory views.

Task Management: Create and track tasks related to orders and stock activities.

Content Management: Publish and retrieve blog articles for food safety and best practices.

Inventory Analytics: Dashboard endpoints for summary metrics, order trends, and recent stock additions.

⚙️ Tech Stack

Runtime: Node.js

Web Framework: Express.js

Database: MongoDB (with Mongoose ODM)

Authentication: JWT (stateless, with token blacklisting for sign-out)

Error Handling: Custom AppError class and centralized middleware

🗂 Directory Structure

backend/
├─ src/
│  ├─ controllers/      # Business logic handlers
│  ├─ models/           # Mongoose schemas
│  ├─ routes/           # API route definitions
│  ├─ middleware/       # Authentication & error middlewares
│  ├─ utils/            # Helper utilities (errors)
│  ├─ app.js            # Express application setup
│  └─ server.js         # Database connection & server start
|              
├─ .env                 # Environment variables
├─ package.json         # Dependencies & scripts
└─ README.md            # Project documentation


🚀 Getting Started

Clone the repository:

git clone <repo-url> && cd backend
Install dependencies:

npm install

Configure environment:

Create a .env file in the project root.

Define:

MONGO_URI=mongodb://localhost:27017/grocerydb
PORT=9000
JWT_SECRET=your_jwt_secret_here

Start the server in development mode:

npm run dev
The API will run at http://localhost:9000.

🔑 Environment Variables

MONGO_URI: MongoDB connection string.

PORT: Port on which Express listens.

JWT_SECRET: Secret key for signing JWT tokens.

📡 API Endpoints Overview

Every request that modifies or retrieves user-specific data requires the HTTP header:

Authorization: Bearer <your_jwt_token>

1. Authentication :

POST /register: Create a new manager account.

POST /signin: Authenticate and receive a JWT.

GET /profile: Retrieve the logged-in manager’s profile.

POST /signout: Log out and invalidate the current token.

2. Products :

POST /products: Add a new product (name, SKU, prices).

GET /products: List all products, sorted by creation date.

GET /products/:id: Retrieve a single product.

PUT /products/:id: Update product details.

DELETE /products/:id: Remove a product.

3. Orders & Dashboard Metrics :

POST /orders: Place a new supplier order.

GET /orders: List all orders, filterable by date and status.

GET /orders/stats?startDate=&endDate=: Fetch counts of Active vs. Inactive orders in a date range.

4. Shipments :

POST /shipment: Register a new shipment entry.

GET /shipment: Overall shipment status counts.

GET /shipmentDetails: Paginated shipment records, filter by status.

PUT/DELETE /shipment/:id: Update or remove a shipment record.

5. Stock Management : 

POST /stock: Log a new stock entry (delivery, audit, restock).

GET /stockDetails: Paginated, status-filtered list of stock entries with consumer & supplier info.

6. Task Management :

POST /tasks: Create a task (order or stock related) with assignee, due date, and priority.

7. Blog Content :

POST /blogs (optional): Publish a new article.

GET /blogs/all? pageNumber=&offset=: Paginated list of blogs ordered by date.

GET /blog/:id: Retrieve a specific article.

Upcoming Features  - 

Inventory Analytics

GET /inventory/summary: High-level metrics: total stock, low stock, out-of-stock, high-demand orders.

GET /inventory/orders?view=daily|monthly: Time-series data for orders.

GET /inventory/newStock: Most recent stock additions.

🔧 Error Handling Strategy

Use a custom AppError class for operational errors.

Centralized middleware logs unexpected exceptions and returns:

{ "status": <code>, "message": "<description>" }
