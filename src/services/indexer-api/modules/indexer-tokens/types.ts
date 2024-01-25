import type { TypeOf } from 'zod'
import type { Insc20Schema, Insc20BalanceSchema, TokenHolderSchema, Insc20QueryFilterSchema } from './validators'

export type Insc20 = TypeOf<typeof Insc20Schema>
export type Insc20Balance = TypeOf<typeof Insc20BalanceSchema>
export type TokenHolder = TypeOf<typeof TokenHolderSchema>
export type Insc20QueryFilter = TypeOf<typeof Insc20QueryFilterSchema>
export enum OrderStatus {
  PENDING = 'Pending',
  LISTED = 'Listed',
  BOUGHT = 'Bought',
  SOLD = 'Sold',
  CANCELLED = 'Cancelled',
}
