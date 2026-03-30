import { prisma } from '../utils/db';
import { z } from 'zod';

export const CreateCriterionSchema = z.object({
  name: z.string().min(1, "Criterion name is required").max(255),
  weight: z.number().min(1, "Weight must be at least 1").max(5, "Weight cannot exceed 5"),
});

export const UpdateCriterionSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  weight: z.number().min(1).max(5).optional(),
});

export const addCriterionToDecision = async (decisionId: string, name: string, weight: number) => {
  return prisma.criterion.create({
    data: { name, weight, decisionId },
  });
};

export const updateCriterion = async (criterionId: string, data: { name?: string; weight?: number }) => {
  return prisma.criterion.update({
    where: { id: criterionId },
    data,
  });
};

export const deleteCriterion = async (criterionId: string) => {
  return prisma.criterion.delete({
    where: { id: criterionId },
  });
};
