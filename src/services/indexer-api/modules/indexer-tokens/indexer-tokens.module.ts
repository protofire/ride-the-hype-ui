import z from 'zod'
import type { Axios } from 'axios'

import type { OrderParams, PaginationQuery, Transaction } from '~/services/indexer-api/types'
import { TransactionSchema } from '~/services/indexer-api/validators'

import { Insc20BalanceSchema, Insc20Schema, TokenHolderSchema } from './validators'
import type { Insc20, Insc20Balance, TokenHolder, Insc20QueryFilter } from './types'

import {
  MarketplaceCreateOrderPayloadSchema,
  MarketplaceListSchema,
  MarketplaceOrderListSchema,
  MarketplaceOrderPayloadSchema,
  NonceSchema,
  TimestampSchema,
} from '../marketplace/validators/marketplace.schema'
import type {
  MarketplaceOrderPayload,
  MarketplaceOrderCreatePayload,
  MarketplaceList,
  MarketplaceOrderList,
  Timestamp,
  Nonce,
} from '../marketplace/types'

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

  public async getAddressNonce(address: string): Promise<Nonce> {
    const response = await this.client.get(`api/v1/users/${address}/nonce`)

    return NonceSchema.parseAsync(response.data)
  }

  public async signCancelOrder(
    order: MarketplaceOrderPayload,
    message: string,
    signature: string,
  ): Promise<MarketplaceOrderPayload> {
    const response = await this.client.post(
      `api/v1/orders/cancel/sign?message=${message}&signature=${signature}`,
      JSON.stringify(order),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    return MarketplaceOrderPayloadSchema.parseAsync(response.data)
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

  public async getMarketplaceDataByTick(params?: OrderParams): Promise<MarketplaceOrderList> {
    const response = await this.client.get(`api/v1/orders`, {
      params,
    })

    return MarketplaceOrderListSchema.parseAsync(response.data)
  }

  public async getTimestamp(): Promise<Timestamp> {
    const response = await this.client.get('api/v1/timestamp')

    return TimestampSchema.parseAsync(response.data)
  }
}
