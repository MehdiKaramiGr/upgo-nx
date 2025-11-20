import z from "zod";

const folderPayloadDto = z.object({
  id: z.uuid().optional(),
  name: z.coerce.string().optional(),
  parent_id: z.uuid().optional(),
});

export { folderPayloadDto };
export type folderPayloadDtoType = z.infer<typeof folderPayloadDto>;

const deleteFolderQueryDto = z.object({
  id: z.uuid(),
  recursive: z.coerce
    .string()
    .optional()
    .transform((val) => val === "true"),
});

export { deleteFolderQueryDto };
export type deleteFolderQueryDtoType = z.infer<typeof deleteFolderQueryDto>;
