// lib/openapi.ts
import { z } from "zod";
import {
	OpenAPIRegistry,
	extendZodWithOpenApi,
	OpenApiGeneratorV31,
} from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const registry = new OpenAPIRegistry();

// 🧩 مثال از یک اسکیمای ساده
const UserSchema = z
	.object({
		id: z
			.string()
			.uuid()
			.openapi({ example: "a7b3b21e-3ef4-4c92-9c0b-f3a8b77a7123" }),
		email: z.string().email().openapi({ example: "mehdi@example.com" }),
		name: z.string().openapi({ example: "Mehdi Karami" }),
	})
	.openapi("User");

registry.register("User", UserSchema);

// 🧭 مسیر نمونه
// lib/openapi.ts
registry.registerPath({
	method: "get",
	path: "/api/users",
	tags: ["Users"],
	responses: {
		200: {
			description: "List of all users",
			content: {
				"application/json": {
					schema: z.array(UserSchema),
				},
			},
		},
	},
});

// 📄 ساخت مستندات نهایی
const generator = new OpenApiGeneratorV31(registry.definitions);
export const document = generator.generateDocument({
	openapi: "3.1.0",
	info: {
		title: "Upgo NX API",
		version: "1.0.0",
		description: "Auto-generated OpenAPI docs using Zod and zod-to-openapi",
	},
	servers: [{ url: "http://localhost:3000" }],
});
