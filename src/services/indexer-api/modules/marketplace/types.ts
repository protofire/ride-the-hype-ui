import type { TypeOf } from 'zod'
import type {
  MarketplaceActivitySchema,
  MarketplaceCreateOrderPayloadSchema,
  MarketplaceOrderPayloadSchema,
  MarketplaceOrderSchema,
  MarketplaceSchema,
  MarketplaceTokenSchema,
} from './validators'

export type Marketplace = TypeOf<typeof MarketplaceSchema>
export type MarketplaceActivity = TypeOf<typeof MarketplaceActivitySchema>
export type MarketplaceToken = TypeOf<typeof MarketplaceTokenSchema>
export type MarketplaceOrder = TypeOf<typeof MarketplaceOrderSchema>
export type MarketplaceOrderPayload = TypeOf<typeof MarketplaceOrderPayloadSchema>
export type MarketplaceOrderCreatePayload = TypeOf<typeof MarketplaceCreateOrderPayloadSchema>
