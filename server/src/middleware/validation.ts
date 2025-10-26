import { body, query, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateCreateVacation = [
  body("user_id")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),
  body("start_date")
    .isDate()
    .withMessage("Start date must be a valid date"),
  body("end_date")
    .isDate()
    .withMessage("End date must be a valid date"),
  body("reason")
    .trim()
    .optional()
    .isLength({ max: 500 })
    .withMessage("If provided, reason must be less than 500 characters"),
];

export const validateGetMyVacations = [
  query("userId")
    .isInt({ min: 1 })
    .withMessage("User ID must be a positive integer"),
];

export const validateGetAllVacations = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("status")
    .optional()
    .isIn(["Pending", "Approved", "Rejected"])
    .withMessage("Status must be one of: Pending, Approved, Rejected"),
];

export const validateUpdateVacationStatus = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("Vacation ID must be a positive integer"),
  body("status")
    .isIn(["Pending", "Approved", "Rejected"])
    .withMessage("Status must be one of: Pending, Approved, Rejected"),
  body("validatorId")
    .isInt({ min: 1 })
    .withMessage("Validator ID must be a positive integer"),
  body("comments")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Comments must not exceed 1000 characters"),
];

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

