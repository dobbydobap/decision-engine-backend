import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AppError } from '../middlewares/error.middleware';
import {
  createDecision,
  getUserDecisions,
  getDecisionById,
  evaluateDecision,
  deleteDecision,
  updateDecision,
} from '../services/decision.service';

export const create = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const newDecision = await createDecision(req.body.title, userId);
    res.status(201).json({
      message: 'Decision created successfully',
      data: newDecision,
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getUserDecisions(userId, page, limit);
    res.status(200).json({
      message: 'Decisions retrieved successfully',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const decision = await getDecisionById(req.params.id as string, userId);
    res.status(200).json({
      message: 'Decision retrieved successfully',
      data: decision,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const updated = await updateDecision(req.params.id as string, userId, req.body.title);
    res.status(200).json({
      message: 'Decision updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const evaluate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    const results = await evaluateDecision(req.params.id as string, userId);
    res.status(200).json({
      message: 'Decision evaluated successfully',
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    await deleteDecision(req.params.id as string, userId);
    res.status(200).json({
      message: 'Decision and all associated data deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
