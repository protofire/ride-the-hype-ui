import { z } from 'zod'

export const Insc20BalanceSchema = z.object({
  tokenId: z.string().uuid(),
  address: z.string(),
  amount: z.string(),
})
