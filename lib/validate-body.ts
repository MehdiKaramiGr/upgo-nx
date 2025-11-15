import { z, ZodSchema } from "zod";

/**
 * Parses and validates the JSON body of a Request using a Zod schema.
 * @param req Request object
 * @param schema Zod schema to validate body
 * @returns Parsed data if valid, or throws ZodError
 */
export async function validateBody<T extends ZodSchema<any>>(
  req: Request,
  schema: T
) {
  const body = await req.json();
  console.log("body", body);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw parsed.error;
  }

  return parsed.data as z.infer<T>;
}
