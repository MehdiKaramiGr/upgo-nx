import z from "zod";

const appActionQueryDto = z.object({
  cur_users: z.coerce.boolean().optional(),
  only_ids: z.coerce.boolean().optional(),
  user_id: z.uuid().optional(),
  role_id: z.coerce.number().optional(),
});

export { appActionQueryDto };

export type appActionQueryType = z.infer<typeof appActionQueryDto>;
