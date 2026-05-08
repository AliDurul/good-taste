import z from "zod";

export const userCreateSchema = z
  .object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    age: z.number().int().positive().max(120),
    password: z.string().min(8),
  })
  .strict();

export const userUpdateSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
    age: z.number().int().positive().max(120).optional(),
    password: z.string().min(8).optional(),
  })
  .strict();

export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
