import type { Axios } from 'axios'

import type { PaginationQuery } from '~/services/indexer-api/types'
import { PaginationQuerySchema } from '~/services/indexer-api/validators'
import { Insc20Schema } from './validators'
import type { Insc20 } from './types'
import z from 'zod'

export class IndexerTokensModule {
  constructor(private client: Axios) {}

  public async getAllInsc20(parameters?: PaginationQuery): Promise<Insc20[]> {
    const params = await PaginationQuerySchema.optional().parseAsync(parameters)
    const response = await this.client.get('api/v1/tokens', {
      params,
    })

    return Insc20Schema.array().parseAsync(response.data)
  }

  public async getInsc20ByTick(tick: string): Promise<Insc20> {
    const ticker = await z.string().parseAsync(tick)
    const response = await this.client.get(`api/v1/tokens/${ticker}`)

    return Insc20Schema.parseAsync(response.data)
  }
}
