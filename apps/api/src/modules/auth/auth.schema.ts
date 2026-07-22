import { z } from 'zod'

export const registerSchema = z.object({
  storeName: z.string().min(2, 'Nome da loja muito curto'),
  userName: z.string().min(2, 'Nome muito curto'),
  email: z.email('Email inválido'),
  password: z.string().min(6, 'Senha precisa ter no mínimo 6 caracteres'),
})

export type RegisterInput = z.infer<typeof registerSchema>