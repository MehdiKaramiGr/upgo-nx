import z from "zod";

const moveFilePayloadDto = z.object({
  file_id: z.uuid(),
  folder_id: z.uuid().nullable(),
});

export { moveFilePayloadDto };
export type moveFilePayloadDtoType = z.infer<typeof moveFilePayloadDto>;

const deleteFilesPayloadDto = z.object({
  id: z.array(z.uuid()),
});

export { deleteFilesPayloadDto };
export type deleteFilesPayloadDtoType = z.infer<typeof deleteFilesPayloadDto>;
