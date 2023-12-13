import type { TypeOf } from 'zod'
import type { Insc20Schema, Insc20BalanceSchema } from './validators'

export type Insc20 = TypeOf<typeof Insc20Schema>
export type Insc20Balance = TypeOf<typeof Insc20BalanceSchema>