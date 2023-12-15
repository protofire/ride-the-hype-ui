import { z } from 'zod'

export const TokenHolderSchema = z.object({
  address: z.string(),
  amount: z.string(),
})
