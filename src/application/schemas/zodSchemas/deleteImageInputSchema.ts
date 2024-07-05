import { z } from 'zod';

export const deleteImageInputSchema = z.object({
  publicId: z.string(),
});
