import express from "express";
import cors from "cors";
import { sequelize } from "./config/db";
import vacationRoutes from "./routes/vacationRoutes";
import userRoutes from "./routes/userRoutes";
import { seedDatabase } from "./seed";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/vacations", vacationRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 4000;

sequelize.sync({ alter: true }).then(async () => {
  await seedDatabase(); // Seed the database with initial data
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});