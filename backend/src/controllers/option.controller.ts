import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AppError } from '../middlewares/error.middleware';
import { addOptionToDecision, updateOption, deleteOption } from '../services/option.service';
import { getDecisionById } from '../services/decision.service';

export const createOption = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    await getDecisionById(req.params.decisionId as string, userId);
    const newOption = await addOptionToDecision(req.params.decisionId as string, req.body.name);

    res.status(201).json({
      message: 'Option added successfully',
      data: newOption,
    });
  } catch (error) {
    next(error);
  }
};

export const patchOption = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    await getDecisionById(req.params.decisionId as string, userId);
    const updated = await updateOption(req.params.optionId as string, req.body.name);

    res.status(200).json({
      message: 'Option updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const removeOption = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) throw new AppError('Unauthorized', 401);

    await getDecisionById(req.params.decisionId as string, userId);
    await deleteOption(req.params.optionId as string);

    res.status(200).json({
      message: 'Option deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
