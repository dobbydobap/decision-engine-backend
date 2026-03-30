import { prisma } from '../utils/db';
import { z } from 'zod';

export const CreateScoreSchema = z.object({
  optionId: z.string().uuid("Invalid Option ID"),
  criterionId: z.string().uuid("Invalid Criterion ID"),
  value: z.number().min(1, "Score must be at least 1").max(10, "Score cannot exceed 10"),
});

export const UpdateScoreSchema = z.object({
  value: z.number().min(1, "Score must be at least 1").max(10, "Score cannot exceed 10"),
});

export const assignScore = async (optionId: string, criterionId: string, value: number) => {
  return prisma.score.create({
    data: { value, optionId, criterionId },
  });
};

export const updateScore = async (scoreId: string, value: number) => {
  return prisma.score.update({
    where: { id: scoreId },
    data: { value },
  });
};
