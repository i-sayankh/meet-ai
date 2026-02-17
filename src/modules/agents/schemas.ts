import { z } from "zod";

export const agentsInsertSchema = z.object({
  name: z.string().min(3, { message: "Name is required" }),
  instructions: z.string().min(10, { message: "Instructions are required" }),
});

export const agentsUpdateSchema = agentsInsertSchema.extend({
  id: z.string().min(1, { message: "ID is required" }),
});
