// Source - https://stackoverflow.com/a/79876604
// Posted by Tiago Correia, modified by community. See post 'Timeline' for change history
// Retrieved 2026-03-26, License - CC BY-SA 4.0

// this will fix zod resolver error in react hook form
/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from "zod";

/**
 * Custom Zod resolver for React Hook Form that safely handles validation errors
 * without throwing uncaught promise exceptions.
 *
 * @param schema - Zod schema to validate against
 * @returns Resolver function compatible with React Hook Form
 *
 * @example
 * ```tsx
 * const schema = z.object({ name: z.string().min(1) });
 * const form = useForm({ resolver: safeZodResolver(schema) });
 * ```
 */
export const safeZodResolver = <T extends z.ZodType<any, any>>(schema: T) => {
  return async (data: any, _context: any, _optionss: any) => {
    try {
      const result = await schema.safeParseAsync(data);

      if (!result.success) {
        return {
          values: {},
          errors: result.error.issues.reduce((acc: any, issue) => {
            const path = issue.path.join(".");
            if (!acc[path]) {
              acc[path] = {
                type: issue.code,
                message: issue.message,
              };
            }
            return acc;
          }, {}),
        };
      }

      return {
        values: result.data,
        errors: {},
      };
    } catch (error) {
      console.error("Validation error:", error);
      return {
        values: {},
        errors: {
          root: {
            type: "manual",
            message: "Form error validation",
          },
        },
      };
    }
  };
};
