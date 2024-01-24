// import type { TypeOf, z } from 'zod'
// import {
//   createListSchema,
//   type MarketplaceActivitySchema,
//   type MarketplaceCreateOrderPayloadSchema,
//   type MarketplaceOrderPayloadSchema,
//   type MarketplaceOrderSchema,
//   type MarketplaceSchema,
//   type MarketplaceTokenSchema,
// } from './validators'

// export type Marketplace = TypeOf<typeof MarketplaceSchema>
// export type MarketplaceActivity = TypeOf<typeof MarketplaceActivitySchema>
// export type MarketplaceToken = TypeOf<typeof MarketplaceTokenSchema>
// export type MarketplaceOrder = TypeOf<typeof MarketplaceOrderSchema>
// export type MarketplaceOrderPayload = TypeOf<typeof MarketplaceOrderPayloadSchema>
// export type MarketplaceOrderCreatePayload = TypeOf<typeof MarketplaceCreateOrderPayloadSchema>

// type MarketplaceOrderList = z.infer<typeof newcreateListSchema(MarketplaceOrder)>

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
} from './validators'

export type Marketplace = TypeOf<typeof MarketplaceSchema>
export type MarketplaceActivity = TypeOf<typeof MarketplaceActivitySchema>
export type MarketplaceOrder = TypeOf<typeof MarketplaceOrderSchema>
export type MarketplaceOrderPayload = TypeOf<typeof MarketplaceOrderPayloadSchema>
export type MarketplaceOrderCreatePayload = TypeOf<typeof MarketplaceCreateOrderPayloadSchema>

// Lists
export type MarketplaceList = TypeOf<typeof MarketplaceListSchema>
export type MarketplaceActivityList = TypeOf<typeof MarketplaceActivityListSchema>
export type MarketplaceOrderList = TypeOf<typeof MarketplaceOrderListSchema>
export type MarketplaceOrderPayloadList = TypeOf<typeof MarketplaceOrderPayloadSchema>
