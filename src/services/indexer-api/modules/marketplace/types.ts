import type { TypeOf } from 'zod'
import type { MarketplaceActivitySchema, MarketplaceSchema, MarketplaceTokenSchema } from './validators'

export type Marketplace = TypeOf<typeof MarketplaceSchema>
export type MarketplaceActivity = TypeOf<typeof MarketplaceActivitySchema>
export type MarketplaceToken = TypeOf<typeof MarketplaceTokenSchema>
