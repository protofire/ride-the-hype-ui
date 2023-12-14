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
  tick: z.string(),
  type: z.string(),
  from: z.string(),
  to: z.string().array(),
  // FIXME: should be object or string
  data: z.any(),
  blockNumber: z.string(),
  createdAt: z.string(),
})

export const InscriptionSchema = z.object({
  id: z.number().int(),
  hash: z.string(),
  creator: z.string(),
  owner: z.string(),
  content: z.string(),
  contentType: z.string(),
  createdAt: z.string(),
})

export * from './pagination-query.schema'
