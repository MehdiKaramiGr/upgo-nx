import z from "zod";

const appPageQueryDto = z.object({
  cur_users: z.coerce.boolean().optional(),
  only_ids: z.coerce.boolean().optional(),
  user_id: z.uuid().optional(),
});

export { appPageQueryDto };

export type appPageQueryType = z.infer<typeof appPageQueryDto>;
