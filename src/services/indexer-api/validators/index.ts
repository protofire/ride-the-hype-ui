import z from 'zod'

export const IndexerApiStatusSchema = z.object({
  id: z.string().uuid(),
  lastBlock: z.string(),
  synced: z.boolean(),
})

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  hash: z.string(),
  protocol: z.string(),
  type: z.string(),
  from: z.string(),
  to: z.string().array(),
  // FIXME: should be object or string
  data: z.any(),
  blockNumber: z.string(),
  createdAt: z.date(), // DateTime @default(now()) @map("created_at")
})

export const InscriptionSchema = z.object({
  id: z.number().int(),
  hash: z.string(),
  creator: z.string(),
  owner: z.string(),
  content: z.string(),
  createdAt: z.string(),
})

export const intString = z.string().transform((x) => parseInt(x, 10))

export const PaginationQuerySchema = z.object({
  page: intString.pipe(z.number().min(1)).optional().default('1'),
  limit: intString.pipe(z.number().min(1).max(100)).optional().default('20'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
})
