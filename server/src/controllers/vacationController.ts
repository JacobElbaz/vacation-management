import { Request, Response, NextFunction } from "express";
import VacationRequest from "../models/VacationRequest";
import User from "../models/User";
import { createError } from "../middleware/errorHandler";

export const createVacation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id, start_date, end_date, reason } = req.body;

    // Validate date range
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      throw createError(400, "Start date cannot be in the past");
    }

    if (endDate < startDate) {
      throw createError(400, "End date must be after start date");
    }

    // Check if user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      throw createError(404, "User not found");
    }

    // Check for overlapping vacation requests
    const overlappingVacations = await VacationRequest.findAll({
      where: {
        user_id,
        status: "Pending",
      },
    });

    for (const vacation of overlappingVacations) {
      const vacationData = vacation.get({ plain: true }) as any;
      const vacationStart = new Date(vacationData.start_date);
      const vacationEnd = new Date(vacationData.end_date);

      if (
        (startDate >= vacationStart && startDate <= vacationEnd) ||
        (endDate >= vacationStart && endDate <= vacationEnd) ||
        (startDate <= vacationStart && endDate >= vacationEnd)
      ) {
        throw createError(409, "You already have a pending vacation request for this date range");
      }
    }

    const vacationRequest = await VacationRequest.create({
      user_id,
      start_date,
      end_date,
      reason,
    });

    res.status(201).json({
      success: true,
      data: vacationRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyVacations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.query;

    // Check if user exists
    const user = await User.findByPk(userId as string);
    if (!user) {
      throw createError(404, "User not found");
    }

    const vacations = await VacationRequest.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    res.status(200).json(vacations);
  } catch (error) {
    next(error);
  }
};

export const getAllVacations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Validate page number
    if (page < 1) {
      throw createError(400, "Page must be greater than 0");
    }

    const where = status ? { status } : {};

    const { count, rows: vacations } = await VacationRequest.findAndCountAll({
      where,
      include: [{ model: User, as: "User" }],
      limit,
      offset,
      order: [["created_at", "DESC"]],
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
        vacations,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const updateVacationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;

    // Check if vacation request exists
    const vacation = await VacationRequest.findByPk(id);
    if (!vacation) {
      throw createError(404, "Vacation request not found");
    }

    await VacationRequest.update({ status, comments }, { where: { id } });

    res.status(200).json({
      success: true,
      message: "Vacation request updated successfully",
    });
  } catch (error) {
    next(error);
  }
};