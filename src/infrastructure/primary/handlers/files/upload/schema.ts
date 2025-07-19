import { z } from 'zod';

export const schema = z.object({
  file: z.string(),
  uploaderId: z.string(),
  tags: z.string().optional(),
});

export type UploadDTO = z.infer<typeof schema>;
