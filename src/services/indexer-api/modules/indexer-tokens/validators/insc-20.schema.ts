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
  progress: z.number().nullable(),
  completedAt: z.string().nullable(),
  completedTx: z.string().nullable(),
  holders: z.number(),
  transactions: z.number(),
  transactionsLast24h: z.number().optional(),
  transactionsLast1h: z.number().optional(),
  badge: z.string().optional(),
})
