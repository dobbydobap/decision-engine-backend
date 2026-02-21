import { prisma } from '../utils/db';
import { z } from 'zod';

export const CreateCriterionSchema = z.object({
  name: z.string().min(1, "Criterion name is required").max(255),
  weight: z.number().min(1, "Weight must be at least 1").max(5, "Weight cannot exceed 5"),
});
export const addCriterionToDecision = async (decisionId: string, name: string, weight: number) => {
  const newCriterion = await prisma.criterion.create({
    data: {
      name,
      weight,
      decisionId,
    },
  });

  return newCriterion;
};