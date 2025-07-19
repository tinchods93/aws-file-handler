import { fromError } from 'zod-validation-error';
import SchemaValidationException from '../errors/SchemaValidationException';

const handleZodError = (error: any) => {
  const prefix = 'Validation error';
  const formatted = fromError(error)
    .toString()
    ?.replace(`${prefix}: `, '')
    .replace(/"/g, '')
    .trim()
    .split('; ');

  throw SchemaValidationException.handle({ message: formatted });
};

export default handleZodError;
