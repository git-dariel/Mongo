import { AppError } from "@/middleware/errorHandler";
import { z, ZodTypeAny } from "zod";

// helper function to validate incoming request body against the expected schema
export const validateBody = <T extends ZodTypeAny>(
  body: unknown,
  ZodSchema: T,
) => {
  const parsedBody = ZodSchema.safeParse(body);
  if (!parsedBody.success) throw new AppError("Invalid request body", 400);
  return parsedBody.data as z.infer<T>;
};
