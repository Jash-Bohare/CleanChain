const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Auth Routes (wallet login, profile update)
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Location Routes (fetch locations, claim spot)
const locationRoutes = require("./routes/locations");
app.use("/api", locationRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
