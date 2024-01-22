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

export const MarketplaceOrderSchema = z.object({
  seller: z.string(),
  creator: z.string(),
  listId: z.string(),
  ticker: z.string(),
  amount: z.string(),
  price: z.string(),
  listingTime: z.number(),
  expirationTime: z.number(),
  creatorFeeRate: z.number(),
  salt: z.number(),
  extraParams: z.string().optional(),
})

export const MarketplaceOrderPayloadSchema = z.object({
  order: MarketplaceOrderSchema.optional(),
  v: z.number().optional(),
  r: z.string().optional(),
  s: z.string().optional(),
})

export const MarketplaceCreateOrderPayloadSchema = z.object({
  listId: z.string().optional(),
})
