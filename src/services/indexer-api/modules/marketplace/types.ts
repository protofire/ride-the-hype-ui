import type { TypeOf } from 'zod'
import type {
  MarketplaceSchema,
  MarketplaceActivitySchema,
  MarketplaceOrderSchema,
  MarketplaceOrderPayloadSchema,
  MarketplaceListSchema,
  MarketplaceActivityListSchema,
  MarketplaceOrderListSchema,
  MarketplaceCreateOrderPayloadSchema,
  MarketplaceOrderExtendedSchema,
  TimestampSchema,
  NonceSchema,
} from './validators'

//Common
export type Timestamp = TypeOf<typeof TimestampSchema>
export type Nonce = TypeOf<typeof NonceSchema>

export type Marketplace = TypeOf<typeof MarketplaceSchema>
export type MarketplaceActivity = TypeOf<typeof MarketplaceActivitySchema>
export type MarketplaceOrder = TypeOf<typeof MarketplaceOrderSchema>
export type MarketplaceOrderExtended = TypeOf<typeof MarketplaceOrderExtendedSchema>

// Payloads
export type MarketplaceOrderPayload = TypeOf<typeof MarketplaceOrderPayloadSchema>
export type MarketplaceOrderCreatePayload = TypeOf<typeof MarketplaceCreateOrderPayloadSchema>

// Lists
export type MarketplaceList = TypeOf<typeof MarketplaceListSchema>
export type MarketplaceActivityList = TypeOf<typeof MarketplaceActivityListSchema>
export type MarketplaceOrderList = TypeOf<typeof MarketplaceOrderListSchema>
