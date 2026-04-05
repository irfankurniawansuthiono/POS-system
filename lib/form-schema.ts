import { PaymentTerm } from "@/app/generated/prisma";
import { roleList } from "@/modules/admin/ui/config/auth/role.user";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().optional(),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    const { password, confirmPassword } = data;

    // 🔥 PRIORITAS UTAMA
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Password does not match",
        path: ["confirmPassword"],
      });
      return; // ⛔ STOP validasi lain
    }

    // ✅ Validasi lanjutan (hanya kalau sudah match)
    if (confirmPassword.length < 8) {
      ctx.addIssue({
        code: "custom",
        message: "Confirm password must be at least 8 characters",
        path: ["confirmPassword"],
      });
    }

    if (!/[a-z]/.test(confirmPassword) || !/[A-Z]/.test(confirmPassword)) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain uppercase & lowercase",
        path: ["confirmPassword"],
      });
    }

    if (!/\d/.test(confirmPassword)) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain number",
        path: ["confirmPassword"],
      });
    }

    if (!/[@$!%*#?&]/.test(confirmPassword)) {
      ctx.addIssue({
        code: "custom",
        message: "Password must contain special character",
        path: ["confirmPassword"],
      });
    }
  });

export const resetPasswordAdminSchema = z
  .object({
    id: z.string(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password does not match",
    path: ["confirmPassword"],
  });

// Type user schema
export const roleEnum = z.enum(roleList);

export const addUserSchema = registerSchema.extend({
  role: roleEnum,
});

// Type category schema
export const addCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters"),
  parentId: z.string().optional(),
  categoryIndex: z.number().optional(),
});

export const editCategorySchema = addCategorySchema.extend({
  id: z.string().optional(),
  name: z.string().min(2, "Category name must be at least 2 characters"),
});

// type brand schema
export const addBrandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  logoUrl: z.string().optional(),
});
export const editBrandSchema = addBrandSchema.extend({
  id: z.string().optional(),
});

// type Supplier Schema
export const addSupplierSchema = z
  .object({
    name: z.string().min(2, "Supplier name must be at least 2 characters"),
    companyName: z
      .string()
      .min(2, "Company name must be at least 2 characters"),
    contactPerson: z.string().optional(),

    phone: z.string().min(10, "Valid phone required"),
    email: z.string().email("Invalid email address").optional(),

    address: z.string().min(5, "Address is required"),
    gmapsUrl: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value) return true;
          const googleMapsRegex =
            /^https?:\/\/(www\.)?(google\.com\/maps|maps\.google\.com)/;
          const result = googleMapsRegex.test(value);
          if (!result) {
            return false;
          }
          return true;
        },
        {
          message: "Invalid Google Maps URL",
        },
      ),
    city: z.string().optional(),
    notes: z.string().optional(),

    paymentTerm: z.enum(PaymentTerm).refine((value) => value !== undefined, {
      message: "Payment term is required",
    }),

    tempoDays: z.number("Tempo days must be a number").optional(),
    bankName: z.string("Bank name is required").optional(),
    bankAccountNumber: z.string("Bank account number is required").optional(),
    accountHolderName: z
      .string("Bank account holder name is required")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentTerm === "TEMPO") {
      if (!data.tempoDays || data.tempoDays <= 0) {
        ctx.addIssue({
          code: "custom",
          message: "Tempo days required for TEMPO",
          path: ["tempoDays"],
        });
      }
      if (!data.bankName) {
        ctx.addIssue({
          code: "custom",
          message: "Bank name is required",
          path: ["bankName"],
        });
      }

      if (!data.bankAccountNumber) {
        ctx.addIssue({
          code: "custom",
          message: "Bank account number is required",
          path: ["bankAccountNumber"],
        });
      }

      if (!data.accountHolderName) {
        ctx.addIssue({
          code: "custom",
          message: "Account holder name is required",
          path: ["accountHolderName"],
        });
      }
    }
  });
// Type auth form
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordAdminFormValues = z.infer<
  typeof resetPasswordAdminSchema
>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
// Type user form
export type AddUserFormValues = z.infer<typeof addUserSchema>;

// Type category form
export type AddCategoryFormValues = z.infer<typeof addCategorySchema>;
export type EditCategoryFormValues = z.infer<typeof editCategorySchema>;

// Type brand form
export type AddBrandFormValues = z.infer<typeof addBrandSchema>;
export type EditBrandFormValues = z.infer<typeof editBrandSchema>;

// Type Supplier form
export type AddSupplierFormValues = z.infer<typeof addSupplierSchema>;
