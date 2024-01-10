import { z } from 'zod'

export const MarketplaceSchema = z.object({
  tick: z.string(),
  volume24h: z.number(),
  volumeAll: z.number(),
  sales24h: z.number(),
  salesAll: z.number(),
  owners: z.number(),
  listed: z.number(),
  marketCap: z.number(),
  floorPrice: z.number(),
})

export const MarketplaceActivitySchema = z.object({
  hash: z.string(),
  event: z.string(),
  tick: z.string(),
  price: z.number(),
  amount: z.number(),
  total: z.number(),
  from: z.string(),
  to: z.string(),
  time: z.number(),
})

export const MarketplaceTokenSchema = z.object({
  id: z.string(),
  tick: z.string(),
  price: z.number(),
  amount: z.number(),
})
