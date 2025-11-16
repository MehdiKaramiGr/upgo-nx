import z from "zod";

const rolePagePayloadDto = z.object({
  role_id: z.coerce.number(),
  page_id: z.coerce.number(),
  active_state: z.boolean(),
});

export { rolePagePayloadDto };

export type appPagePayloadType = z.infer<typeof rolePagePayloadDto>;
