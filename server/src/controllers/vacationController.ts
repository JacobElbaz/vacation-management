import { Request, Response } from "express";
import VacationRequest from "../models/VacationRequest";

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
    const vacations = await VacationRequest.findAll();
    res.status(200).json(vacations);
};

export const updateVacationStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, comments } = req.body;
    await VacationRequest.update({ status, comments }, { where: { id } });
    res.status(200).json({ success: true });
};