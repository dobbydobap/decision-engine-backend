import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { assignScore, CreateScoreSchema } from '../services/score.service';
import { getDecisionById } from '../services/decision.service';

export const createScore = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const decisionId = req.params.decisionId as string;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await getDecisionById(decisionId, userId); 
    const validatedData = CreateScoreSchema.parse(req.body);

    const newScore = await assignScore(
      validatedData.optionId,
      validatedData.criterionId,
      validatedData.value
    );
    
    res.status(201).json({
      message: 'Score assigned successfully',
      data: newScore
    });
  } catch (error: any){
    // P2002 is Prisma's error code for "Unique constraint failed"
    if (error.code === 'P2002'){
      res.status(400).json({ error: 'A score for this option and criterion already exists.' });
      return;
    }
    res.status(400).json({ error: error.message|| 'Failed to assign score' });
  }
};