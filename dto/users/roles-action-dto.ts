import z from "zod";

const roleActionPayloadDto = z.object({
  role_id: z.coerce.number(),
  action_id: z.coerce.number(),
  active_state: z.boolean(),
});

export { roleActionPayloadDto };

export type appActionPayloadType = z.infer<typeof roleActionPayloadDto>;
