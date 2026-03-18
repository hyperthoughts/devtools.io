import Ajv from 'ajv';

export interface ValidationResult {
  valid: boolean;
  errors: Array<{ path: string; message: string }>;
  errorString?: string;
}

export function validateJsonSchema(schemaStr: string, dataStr: string): ValidationResult {
  if (!schemaStr.trim()) return { valid: false, errors: [], errorString: 'Empty schema' };
  if (!dataStr.trim()) return { valid: false, errors: [], errorString: 'Empty data' };

  try {
    const schema = JSON.parse(schemaStr);
    const data = JSON.parse(dataStr);

    const ajv = new Ajv({ allErrors: true });

    let validate;
    try {
      validate = ajv.compile(schema);
    } catch (e: any) {
      return { valid: false, errors: [], errorString: `Invalid schema: ${e.message}` };
    }

    const valid = validate(data);

    if (valid) {
      return { valid: true, errors: [] };
    } else {
      const errors = (validate.errors || []).map((err) => ({
        path: err.instancePath || 'root',
        message: err.message || 'Validation error',
      }));
      return { valid: false, errors };
    }
  } catch (err: any) {
    return { valid: false, errors: [], errorString: `JSON Parsing error: ${err.message}` };
  }
}
