import z from "zod";

const changeUserActiveStateDto = z.object({
  id: z.uuid(),
  active_state: z.boolean(),
});

export { changeUserActiveStateDto };
export type changeUserActiveStateDtoType = z.infer<
  typeof changeUserActiveStateDto
>;
