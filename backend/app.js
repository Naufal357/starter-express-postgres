const express = require("express");
const { pool } = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/users.routes");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
