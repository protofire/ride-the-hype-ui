import z from 'zod'

import { PaginationQuerySchema } from '~/services/indexer-api/validators'
import { Insc20Filter } from '~/types'

export const Insc20MintingStatus = z.nativeEnum(Insc20Filter)

export const Insc20QueryFilterSchema = PaginationQuerySchema.extend({
  mintingStatus: Insc20MintingStatus,
})
