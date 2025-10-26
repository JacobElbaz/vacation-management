import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { createError } from "../middleware/errorHandler";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.findAll();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};