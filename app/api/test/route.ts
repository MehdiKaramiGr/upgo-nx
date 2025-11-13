import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { validateQuery } from "@/lib/validateQuery";

export async function GET(request: Request) {
	try {
		const query = validateQuery(
			request,
			z.object({
				test: z.string().optional(),
				fuck: z.coerce.number(),
			})
		);
		console.log("Validated query:", query);

		const data = await prisma.app_pages.findMany();
		return Response.json(data);
	} catch (err) {
		if (err instanceof z.ZodError) {
			return Response.json({ error: z.treeifyError(err) }, { status: 400 });
		}
		throw err;
	}
}
