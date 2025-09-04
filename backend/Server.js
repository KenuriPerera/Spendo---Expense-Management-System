const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const spendoRoutes = require("./Routes/SpendoRoutes");
require("dotenv").config(); // load .env

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/Expenses", spendoRoutes);

// Connect MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.error("MongoDB connection error ❌:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
