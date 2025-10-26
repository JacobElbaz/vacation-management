import { Request, Response } from "express";
import VacationRequest from "../models/VacationRequest";
import User from "../models/User";

export const createVacation = async (req: Request, res: Response) => {
  const { user_id, start_date, end_date, reason } = req.body;
  const vacationRequest = await VacationRequest.create({ user_id, start_date, end_date, reason });
  res.status(201).json(vacationRequest);
};

export const getMyVacations = async (req: Request, res: Response) => {
    const { userId } = req.query;
    const vacations = await VacationRequest.findAll({ where: { user_id: userId } });
    res.status(200).json(vacations);
};

export const getAllVacations = async (req: Request, res: Response) => {
    const { status } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    const where = status ? { status } : {};
    
    const { count, rows: vacations } = await VacationRequest.findAndCountAll({
        where,
        include: [{ model: User, as: 'User' }],
        limit,
        offset,
        order: [['created_at', 'DESC']]
    });
    
    const totalPages = Math.ceil(count / limit);
    
    res.status(200).json({
        vacations,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: count,
            itemsPerPage: limit
        }
    });
};

export const updateVacationStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, comments } = req.body;
    await VacationRequest.update({ status, comments }, { where: { id } });
    res.status(200).json({ success: true });
};