import { z, ZodSchema } from "zod";

/**
 * Parses and validates query parameters from a URL using a Zod schema.
 * @param input URL or Request object
 * @param schema Zod schema to validate query params
 * @returns Parsed data if valid, or throws ZodError
 */
export function validateQuery<T extends ZodSchema<any>>(
	input: string | Request,
	schema: T
) {
	const url = typeof input === "string" ? new URL(input) : new URL(input.url);
	const params = Object.fromEntries(url.searchParams.entries());

	const parsed = schema.safeParse(params);

	if (!parsed.success) {
		throw parsed.error;
	}

	return parsed.data as z.infer<T>;
}
