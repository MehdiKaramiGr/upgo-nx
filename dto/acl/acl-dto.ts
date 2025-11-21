import { permission } from "process";
import z from "zod";

const aclFileQueryDto = z.object({
  file_id: z.uuid(),
});

export { aclFileQueryDto };

export type aclFileQueryType = z.infer<typeof aclFileQueryDto>;

const aclFileTogglePayloadDto = z.object({
  file_id: z.uuid(),
  user_id: z.uuid(),
  active_state: z.boolean(),
});

export { aclFileTogglePayloadDto };

export type aclFileTogglePayloadType = z.infer<typeof aclFileTogglePayloadDto>;

const changeAclPermissionPayloadDto = z.object({
  acl_id: z.uuid(),
  active_state: z.boolean(),
  permission: z.enum(["read", "write", "share"]),
});

export { changeAclPermissionPayloadDto };

export type changeAclPermissionPayloadType = z.infer<
  typeof changeAclPermissionPayloadDto
>;
