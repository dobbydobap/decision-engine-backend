import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AppError } from '../middlewares/error.middleware';
import { assignScore, updateScore } from '../services/score.service';
import { getDecisionById } from '../services/decision.service';

export const createScore = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    await getDecisionById(req.params.decisionId as string, userId);
    const newScore = await assignScore(
      req.body.optionId,
      req.body.criterionId,
      req.body.value,
    );

    res.status(201).json({
      message: 'Score assigned successfully',
      data: newScore,
    });
  } catch (error) {
    next(error);
  }
};

export const patchScore = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    await getDecisionById(req.params.decisionId as string, userId);
    const updated = await updateScore(req.params.scoreId as string, req.body.value);

    res.status(200).json({
      message: 'Score updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
