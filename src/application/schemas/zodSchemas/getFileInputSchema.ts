import { z } from 'zod';

export const getFileInputSchema = z.object({
  fileName: z.string().optional(),
  fileId: z.string().optional(),
});
