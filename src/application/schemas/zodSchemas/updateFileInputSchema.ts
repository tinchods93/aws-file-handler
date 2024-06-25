import { z } from 'zod';

export const updateFileInputSchema = z.object({
  file: z.string(),
  fileId: z.string(),
});
