import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  age: z.number().min(18, "User must be 18 or older"),
});

export const signupSchema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
}).refine(data => data.email || data.phone, {
  message: "Either email or phone number is required",
  path: ["email"] // This will show the error on the email field
});