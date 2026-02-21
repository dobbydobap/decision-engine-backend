import { prisma } from '../utils/db';
import { z } from 'zod';

// We only need a title to start a decision. The user ID will come from the JWT token.
export const CreateDecisionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
});

//create a Decision
export const createDecision = async (title: string, userId: string) => {
  const newDecision = await prisma.decision.create({
    data: {
      title,
      userId, // We link the decision directly to the user who created it
    },
  });

  return newDecision;
};

//Get All Decisions for a User
export const getUserDecisions = async (userId: string) => {
  const decisions = await prisma.decision.findMany({
    where: { 
      userId: userId // Only fetch decisions belonging to this specific user
    },
    orderBy: { 
      createdAt: 'desc' // Show the newest decisions first
    },
    include: {
      options: true,
      criteria: true,
    }
  });
  return decisions;
};

//get a single decision with all its inner details 
export const getDecisionById = async (decisionId: string, userId: string) => {
  const decision = await prisma.decision.findFirst({
    where: { 
      id: decisionId,
      userId: userId, //Security check: Ensure the user actually owns this decision
    },
    include: {
      options: {
        include: {
          scores: true, //fetchs the scores attached to each option
        }
      },
      criteria: true,
    }
  });

  if (!decision) {
    throw new Error('Decision not found or unauthorized');
  }

  return decision;
};