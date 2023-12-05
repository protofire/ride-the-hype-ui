import type { TypeOf } from 'zod'
import type { InscriptionSchema, TransactionSchema, IndexerApiStatusSchema, PaginationQuerySchema } from './validators'

export type IndexerApiStatus = TypeOf<typeof IndexerApiStatusSchema>
export type Transaction = TypeOf<typeof TransactionSchema>

export type Inscription = TypeOf<typeof InscriptionSchema>
export type PaginationQuery = TypeOf<typeof PaginationQuerySchema>
