import { z } from "zod";

export const arbeitnowJobSchema = z.object({
  slug: z.string(),
  company_name: z.string(),
  title: z.string(),
  description: z.string(),
  remote: z.boolean(),
  url: z.string().url(),
  tags: z.array(z.string()),
  job_types: z.array(z.string()),
  location: z.string(),
  created_at: z.number(),
});

export const arbeitnowResponseSchema = z.object({
  data: z.array(arbeitnowJobSchema),
});


export type ArbeitnowJob = z.infer<typeof arbeitnowJobSchema>;
export type ArbeitnowResponse = z.infer<typeof arbeitnowResponseSchema>;