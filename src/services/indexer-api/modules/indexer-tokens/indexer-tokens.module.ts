import z from 'zod'
import type { Axios } from 'axios'

import type { PaginationQuery, Transaction } from '~/services/indexer-api/types'

import { Insc20BalanceSchema, Insc20Schema, TokenHolderSchema } from './validators'
import type { Insc20, Insc20Balance, TokenHolder } from './types'
import { TransactionSchema } from '../../validators'

export class IndexerTokensModule {
  constructor(private client: Axios) {}

  public async getAllInsc20(params?: PaginationQuery): Promise<Insc20[]> {
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

  public async getUserHoldings(walletAddress: string, params?: PaginationQuery): Promise<Insc20Balance[]> {
    const address = await z.string().parseAsync(walletAddress)
    const response = await this.client.get(`api/v1/users/${address}/balances`, { params })

    // TODO: restore passing data after this method is implemented on BE
    console.log('[getUserHoldings]: ', response.data)

    return Insc20BalanceSchema.array().parseAsync(response.data)
  }

  public async getHoldersByTick(tick: string, params?: PaginationQuery): Promise<TokenHolder[]> {
    const ticker = await z.string().parseAsync(tick)
    const response = await this.client.get(`api/v1/tokens/${ticker}/holders`, {
      params,
    })

    return TokenHolderSchema.array().parseAsync(response.data)
  }

  public async getTransactionsByTick(tick: string, params?: PaginationQuery): Promise<Transaction[]> {
    const ticker = await z.string().parseAsync(tick)
    const response = await this.client.get(`api/v1/tokens/${ticker}/transactions`, {
      params,
    })

    return TransactionSchema.array().parseAsync(response.data)
  }
}
