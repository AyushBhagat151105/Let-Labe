import { ZodError } from "zod";

export function validateSchema(schema, data) {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      };
    }
    return { success: false, error: "Unknown validation error" };
  }
}
