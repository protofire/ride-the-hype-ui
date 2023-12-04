import z from 'zod'

export const InscriptionSchema = z.object({
  id: z.number().int(),
  hash: z.string(),
  creator: z.string(),
  content: z.string(),
  createdAt: z.string(),
})
