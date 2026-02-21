import { prisma } from '../utils/db';
import { z } from 'zod';

export const CreateOptionSchema = z.object({
  name: z.string().min(1, "Option name is required").max(255),
});

//an Option to a specific Decision
export const addOptionToDecision = async (decisionId: string, name: string) => {
  const newOption = await prisma.option.create({
    data: {
      name,
      decisionId, //This links the Option to the parent Decision!
    },
  });

  return newOption;
};