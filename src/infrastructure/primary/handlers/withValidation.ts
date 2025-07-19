import handleZodError from '../schemas/handleZodError';

export function withValidation<DTO>(
  schema: any,
  action: (validated: DTO) => Promise<any>
) {
  return async (payload: any) => {
    const validatedPayload: DTO = await schema
      .parseAsync(payload?.body)
      .catch(handleZodError);

    return action(validatedPayload);
  };
}
