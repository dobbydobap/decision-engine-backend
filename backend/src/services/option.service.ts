import { prisma } from '../utils/db';
import { z } from 'zod';

export const CreateOptionSchema = z.object({
  name: z.string().min(1, "Option name is required").max(255),
});

export const UpdateOptionSchema = z.object({
  name: z.string().min(1, "Option name is required").max(255),
});

export const addOptionToDecision = async (decisionId: string, name: string) => {
  return prisma.option.create({
    data: { name, decisionId },
  });
};

export const updateOption = async (optionId: string, name: string) => {
  return prisma.option.update({
    where: { id: optionId },
    data: { name },
  });
};

export const deleteOption = async (optionId: string) => {
  return prisma.option.delete({
    where: { id: optionId },
  });
};
