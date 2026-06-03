import { z } from "zod";

export const MAIZE_PRODUCTS = [
  "1kg Maize Flour",
  "2kg Maize Flour",
  "5kg Maize Flour",
  "10kg Maize Flour",
  "25kg Maize Flour",
  "50kg Maize Flour",
] as const;

export const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  product: z.enum(MAIZE_PRODUCTS, { message: "Please select a product" }),
  quantity: z.coerce
    .number({ message: "Quantity must be a number" })
    .int()
    .positive("Quantity must be at least 1"),
  message: z.string().optional(),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
