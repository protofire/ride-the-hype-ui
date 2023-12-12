import z from 'zod'

export const intString = z.string().transform((x) => parseInt(x, 10))

export const PaginationQuerySchema = z
  .object({
    page: intString.pipe(z.number().min(1)).default('1'),
    limit: intString.pipe(z.number().min(1).max(100)).default('20'),
    order: z.enum(['asc', 'desc']).default('asc'),
  })
  .partial()
