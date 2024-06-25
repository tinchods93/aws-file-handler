import { z } from 'zod';

export const uploadFileInputSchema = z.object({
  file: z.string(),
  uploaderId: z.string(),
  tags: z.string().optional(),
});
