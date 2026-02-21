import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { addOptionToDecision, CreateOptionSchema } from '../services/option.service';
import { getDecisionById } from '../services/decision.service';

export const createOption = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    // We will grab the decision ID directly from the URL 
    const decisionId = req.params.decisionId as string; 
    
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await getDecisionById(decisionId, userId); 
    const validatedData = CreateOptionSchema.parse(req.body);
    // Tell the database to create it
    const newOption = await addOptionToDecision(decisionId, validatedData.name);
    
    res.status(201).json({
      message: 'Option added successfully',
      data: newOption
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};