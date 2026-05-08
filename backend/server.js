require("dotenv").config();
console.log("ENV TEST:", process.env.DB_HOST);
const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const path = require("path");


const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Existing routes
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/vendors", require("./routes/vendorRoutes"));
app.use("/api/quotations", require("./routes/quotationRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/expenses", require("./routes/expenseRoutes"));

// Advanced Business Modules
app.use("/api/emi", require("./routes/emiRoutes"));
app.use("/api/service", require("./routes/serviceRoutes"));
app.use("/api/exchange", require("./routes/exchangeRoutes"));
app.use("/api/delivery", require("./routes/deliveryRoutes"));
app.use("/api/offers", require("./routes/offersRoutes"));
app.use("/api/suppliers", require("./routes/suppliersRoutes"));
app.use("/api/rent", require("./routes/rentalsRoutes"));

// AI Room Design Feature
app.use("/api/room-ai", require("./routes/roomAIRoutes"));


// --- Advanced E-Commerce APIs (modular routes) ---
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/order', require('./routes/orderRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/ai', require('./routes/airoutes'));
app.use('/api/receipts', require('./routes/receiptRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));



app.get("/", (req, res) => {
  res.send("FurniAI Backend Running ✓");
});

app.listen(5000, () => console.log("Server running on port 5000"));
