import { PaymentTerm } from "@/app/generated/prisma";
import { z } from "zod";
export const getSupplierSchema = z.object({
    limit: z.number().min(1).max(100).default(10),
    page: z.number().min(1).default(1),
    search: z.string().optional(),
    sortBy: z.enum(["name", "email", "createdAt", "updatedAt"]).default("updatedAt").optional(),
    sortDirection: z.enum(["asc", "desc"]).optional(),
    city: z.string().optional(),
    paymentTerms: z.enum(PaymentTerm).optional(),
    hasTempo: z.boolean().optional(),
    hasBank: z.boolean().optional(),
});

export const editSupplierSchema = z
    .object({
        name: z.string().min(2, "Supplier name must be at least 2 characters"),
        companyName: z.string().min(2, "Company name must be at least 2 characters"),
        contactPerson: z.string().optional(),

        phone: z.string().min(10, "Valid phone required"),
        email: z.string().email("Invalid email address").optional(),

        address: z.string().min(5, "Address is required"),
        gmapsUrl: z
            .string()
            .optional()
            .refine(
                value => {
                    if (!value) return true;
                    const googleMapsRegex = /^https?:\/\/(www\.)?(google\.com\/maps|maps\.google\.com)/;
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

        paymentTerm: z.enum(PaymentTerm).refine(value => value !== undefined, {
            message: "Payment term is required",
        }),

        tempoDays: z.number("Tempo days must be a number").optional(),
        bankName: z.string("Bank name is required").optional(),
        bankAccountNumber: z.string("Bank account number is required").optional(),
        accountHolderName: z.string("Bank account holder name is required").optional(),
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

export const deleteSupplierSchema = z.object({
    id: z.string(),
});

export type EditSupplierFormValues = z.infer<typeof editSupplierSchema> & {
    id: string;
};
