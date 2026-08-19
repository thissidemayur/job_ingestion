import { z } from "zod";

export const createDepartmentSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().max(500).optional(),
  }),
});

export const updateDepartmentSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: z
    .object({
      name: z.string().trim().min(2).max(100),
      description: z.string().trim().max(500).optional(),
    })
    .refine(
      (data) => Object.keys(data).length > 0,
      "At least one field must be provided",
    ),
});

export const departmentIdSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});


export type CreateDepartmentInput = z.infer<
  typeof createDepartmentSchema
>["body"];
export type UpdateDepartmentInput = z.infer<
  typeof updateDepartmentSchema
>["body"];
