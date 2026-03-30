import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AppError } from '../middlewares/error.middleware';
import { addCriterionToDecision, updateCriterion, deleteCriterion } from '../services/criterion.service';
import { getDecisionById } from '../services/decision.service';

export const createCriterion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    await getDecisionById(req.params.decisionId as string, userId);
    const newCriterion = await addCriterionToDecision(
      req.params.decisionId as string,
      req.body.name,
      req.body.weight,
    );

    res.status(201).json({
      message: 'Criterion added successfully',
      data: newCriterion,
    });
  } catch (error) {
    next(error);
  }
};

export const patchCriterion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    await getDecisionById(req.params.decisionId as string, userId);
    const updated = await updateCriterion(req.params.criterionId as string, req.body);

    res.status(200).json({
      message: 'Criterion updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const removeCriterion = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    await getDecisionById(req.params.decisionId as string, userId);
    await deleteCriterion(req.params.criterionId as string);

    res.status(200).json({
      message: 'Criterion deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
