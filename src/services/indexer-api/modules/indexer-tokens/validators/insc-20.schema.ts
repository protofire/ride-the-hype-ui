import { z } from 'zod'

export const Insc20Schema = z.object({
  id: z.string(),
  tick: z.string(),
  decimals: z.number().int(),
  maxSupply: z.string(),
  maxMint: z.string(),
  holdLimit: z.string(),
  totalSupply: z.string(),
  creatorAddress: z.string(),
  createdAt: z.string(), // Date
})
