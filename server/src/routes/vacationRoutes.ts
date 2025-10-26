import { Router } from "express";
import {
  createVacation,
  getMyVacations,
  getAllVacations,
  updateVacationStatus,
} from "../controllers/vacationController";

const router = Router();

router.post("/", createVacation);
router.get("/me", getMyVacations);
router.get("/", getAllVacations);
router.patch("/:id", updateVacationStatus);

export default router;