import { z } from 'zod';

const password = z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');

export const signInSchema = z
    .object({
        email: z.email('Enter a valid email address'),
        password,
    })
    .strict();



const signUpSchema = z
    .object({
        fullName: z.string().min(2, 'Full name is required'),
        phone: z.string().min(1, 'Phone number is required'),
        email: z.email('Enter a valid email address'),
        password,
        confirmPassword: password,
        town: z.string().min(1, 'Town or area is required'),
        dateOfBirth: z.string().optional(),
        referralCode: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match',
    })



export type SignInForm = z.infer<typeof signInSchema>;
export type SignUpForm = z.infer<typeof signUpSchema>;