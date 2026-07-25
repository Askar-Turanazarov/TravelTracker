import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный формат email'),
  password: z
    .string()
    .min(1, 'Пароль обязателен'),
})

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email обязателен')
    .email('Некорректный формат email'),
  password: z
    .string()
    .min(8, 'Минимум 8 символов')
    .regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, 'Пароль должен содержать хотя бы одну букву и одну цифру'),
  display_name: z
    .string()
    .min(2, 'Минимум 2 символа')
    .max(100, 'Максимум 100 символов')
    .refine((val) => val.trim().length > 0, 'Имя не может быть пустым'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>