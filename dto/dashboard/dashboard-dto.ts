import { permission } from "process";
import z from "zod";

const dashboardQueryDto = z.object({
  start: z.coerce.string(),
  end: z.coerce.string(),
});

export { dashboardQueryDto };

export type dashboardQueryType = z.infer<typeof dashboardQueryDto>;
