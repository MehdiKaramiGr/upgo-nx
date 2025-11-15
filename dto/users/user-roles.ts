import z from "zod";

const getUsersRolesQueryDto = z.object({
  id: z.uuid(),
});

export { getUsersRolesQueryDto };
export type getUsersRolesQueryDtoType = z.infer<typeof getUsersRolesQueryDto>;

const mutateUsersRolesDto = z.object({
  user_id: z.uuid(),
  role_id: z.number(),
  active_state: z.boolean(),
});

export { mutateUsersRolesDto };
export type mutateUsersRolesDtoType = z.infer<typeof mutateUsersRolesDto>;
