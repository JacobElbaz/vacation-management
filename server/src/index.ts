import express from "express";
import cors from "cors";
import { sequelize } from "./config/db";
import vacationRoutes from "./routes/vacationRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/vacations", vacationRoutes);

const PORT = process.env.PORT || 4000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});