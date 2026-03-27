import {z} from 'zod';
import { roleEnum } from '../form-schema';

export const getUserSchema = z.object({
  limit: z.number().min(1).max(100).default(10),
  page: z.number().min(1).default(1),
  search: z.string().optional(),
});

export const editUserSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(50),
  email: z.string().email(),
  role: roleEnum,
});

export const deleteUserSchema = z.object({
  id: z.string(),
});

export type EditUserFormValues = z.infer<typeof editUserSchema>;