import { Router } from "express";
import {
  createVacation,
  getMyVacations,
  getAllVacations,
  updateVacationStatus,
} from "../controllers/vacationController";
import {
  validateCreateVacation,
  validateGetMyVacations,
  validateGetAllVacations,
  validateUpdateVacationStatus,
  validateRequest,
} from "../middleware/validation";

const router = Router();

router.post("/", validateCreateVacation, validateRequest, createVacation);
router.get("/me", validateGetMyVacations, validateRequest, getMyVacations);
router.get("/", validateGetAllVacations, validateRequest, getAllVacations);
router.patch("/:id", validateUpdateVacationStatus, validateRequest, updateVacationStatus);

export default router;