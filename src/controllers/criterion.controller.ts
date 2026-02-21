import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { addCriterionToDecision, CreateCriterionSchema } from '../services/criterion.service';
import { getDecisionById } from '../services/decision.service';

export const createCriterion = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const decisionId = req.params.decisionId as string;
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    //Ensuring the user owns this decision
    await getDecisionById(decisionId, userId); 
    const validatedData = CreateCriterionSchema.parse(req.body);

    const newCriterion = await addCriterionToDecision(
      decisionId, 
      validatedData.name, 
      validatedData.weight
    );
    
    res.status(201).json({
      message: 'Criterion added successfully',
      data: newCriterion
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};