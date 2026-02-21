import { prisma } from '../utils/db';
import { z } from 'zod';

// scoring a value from 1 to 10
export const CreateScoreSchema = z.object({
  optionId: z.string().uuid("Invalid Option ID"),
  criterionId: z.string().uuid("Invalid Criterion ID"),
  value: z.number().min(1, "Score must be at least 1").max(10, "Score cannot exceed 10"),
});

export const assignScore = async (optionId: string, criterionId: string, value: number) => {
  const newScore = await prisma.score.create({
    data: {
      value,
      optionId,
      criterionId,
    },
  });

  return newScore;
};