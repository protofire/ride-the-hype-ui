import z from 'zod'
import type { Axios } from 'axios'

import type { PaginationQuery, Transaction } from '~/services/indexer-api/types'
import { TransactionSchema } from '~/services/indexer-api/validators'

import { Insc20BalanceSchema, Insc20Schema, TokenHolderSchema } from './validators'
import type { Insc20, Insc20Balance, TokenHolder, Insc20QueryFilter } from './types'

import type { MarketplaceList, MarketplaceOrderCreatePayload, MarketplaceOrderList } from '../marketplace/types'
import type { MarketplaceOrder, MarketplaceOrderPayload } from '../marketplace/types'
import {
  MarketplaceCreateOrderPayloadSchema,
  MarketplaceListSchema,
  MarketplaceOrderListSchema,
  MarketplaceOrderPayloadSchema,
} from '../marketplace/validators/marketplace.schema'

export class IndexerTokensModule {
  constructor(private client: Axios) {}

  public async getAllInsc20(params?: Insc20QueryFilter): Promise<Insc20[]> {
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

  public async signOrder(order: MarketplaceOrder): Promise<any> {
    try {
      const response = await this.client.post('api/v1/orders/sign', JSON.stringify(order), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return MarketplaceOrderPayloadSchema.parseAsync(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  public async createOrder(order: MarketplaceOrderPayload): Promise<MarketplaceOrderCreatePayload> {
    const response = await this.client.post('api/v1/orders/create', JSON.stringify(order), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return MarketplaceCreateOrderPayloadSchema.parseAsync(response.data)
  }

  public async getMarketplaceData(params?: PaginationQuery): Promise<MarketplaceList> {
    const response = await this.client.get(`api/v1/marketplace`, {
      params,
    })

    return MarketplaceListSchema.parseAsync(response.data)
  }

  public async getMarketplaceDataByTick(tick: string, params?: PaginationQuery): Promise<MarketplaceOrderList> {
    const response = await this.client.get(`api/v1/marketplace/${tick}?status=listed`, {
      params,
    })

    return MarketplaceOrderListSchema.parseAsync(response.data)
  }
}
