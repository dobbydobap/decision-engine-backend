import { prisma } from '../utils/db';
import { z } from 'zod';
import { AppError } from '../middlewares/error.middleware';

export const CreateDecisionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
});

export const UpdateDecisionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
});

export const createDecision = async (title: string, userId: string) => {
  return prisma.decision.create({
    data: { title, userId },
  });
};

export const getUserDecisions = async (userId: string, page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [decisions, total] = await Promise.all([
    prisma.decision.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        options: true,
        criteria: true,
      },
      skip,
      take: limit,
    }),
    prisma.decision.count({ where: { userId } }),
  ]);

  return {
    data: decisions,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getDecisionById = async (decisionId: string, userId: string) => {
  const decision = await prisma.decision.findFirst({
    where: { id: decisionId, userId },
    include: {
      options: {
        include: { scores: true },
      },
      criteria: true,
    },
  });

  if (!decision) {
    throw new AppError('Decision not found or unauthorized', 404);
  }

  return decision;
};

export const updateDecision = async (decisionId: string, userId: string, title: string) => {
  await getDecisionById(decisionId, userId);

  return prisma.decision.update({
    where: { id: decisionId },
    data: { title },
  });
};

export const evaluateDecision = async (decisionId: string, userId: string) => {
  const decision = await getDecisionById(decisionId, userId);

  const criteriaWeights: Record<string, { weight: number; name: string }> = {};
  decision.criteria.forEach(c => {
    criteriaWeights[c.id] = { weight: c.weight, name: c.name };
  });

  const evaluatedOptions = decision.options.map(option => {
    let totalScore = 0;
    const scoreBreakdown: Array<{
      criterionId: string;
      criterionName: string;
      originalValue: number;
      weightApplied: number;
      calculatedPoints: number;
    }> = [];

    option.scores.forEach(score => {
      const criterion = criteriaWeights[score.criterionId];
      if (criterion) {
        const weightedScore = score.value * criterion.weight;
        totalScore += weightedScore;

        scoreBreakdown.push({
          criterionId: score.criterionId,
          criterionName: criterion.name,
          originalValue: score.value,
          weightApplied: criterion.weight,
          calculatedPoints: weightedScore,
        });
      }
    });

    return {
      id: option.id,
      name: option.name,
      totalScore,
      breakdown: scoreBreakdown,
    };
  });

  evaluatedOptions.sort((a, b) => b.totalScore - a.totalScore);

  return {
    decisionId: decision.id,
    title: decision.title,
    winner: evaluatedOptions.length > 0 ? evaluatedOptions[0] : null,
    rankings: evaluatedOptions,
  };
};

export const deleteDecision = async (decisionId: string, userId: string) => {
  await getDecisionById(decisionId, userId);
  await prisma.decision.delete({ where: { id: decisionId } });
  return true;
};
