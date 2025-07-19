import { z } from 'zod';

export const schema = z.object({
  id: z.string().uuid(),
});

export type GetDTO = z.infer<typeof schema>;
