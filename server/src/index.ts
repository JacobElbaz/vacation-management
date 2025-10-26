import express from "express";
import cors from "cors";
import { sequelize } from "./config/db";
import vacationRoutes from "./routes/vacationRoutes";
import userRoutes from "./routes/userRoutes";
import { seedDatabase } from "./seed";
import { errorHandler, createError } from "./middleware/errorHandler";

const app = express();

// CORS configuration
app.use(cors());

// Body parser middleware
app.use(express.json());

// API endpoints
app.use("/api/vacations", vacationRoutes);
app.use("/api/users", userRoutes);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  next(createError(404, `Route ${req.originalUrl} not found`));
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

sequelize.sync({ alter: true }).then(async () => {
  await seedDatabase(); // Seed the database with initial data
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});