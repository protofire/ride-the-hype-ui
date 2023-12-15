import { Axios } from 'axios'

import { DEFAULT_INDEXER_API_BASE_URL } from '~/config/constants'
import { IndexerApiStatusSchema, InscriptionSchema, TransactionSchema } from '~/services/indexer-api/validators'
import type { IndexerApiStatus, Inscription, PaginationQuery, Transaction } from '~/services/indexer-api/types'
import { IndexerTokensModule } from '~/services/indexer-api/modules/indexer-tokens'
import { transformAxiosResponse as transformResponse } from '~/utils'

export class IndexerApiService {
  private static instances = new Map<string, IndexerApiService>()

  private readonly client: Axios

  public readonly tokensModule: IndexerTokensModule

  private constructor(baseURL: string) {
    this.client = new Axios({ baseURL, transformResponse })

    this.tokensModule = new IndexerTokensModule(this.client)
  }

  public static getInstance = (baseUrl: string = DEFAULT_INDEXER_API_BASE_URL): IndexerApiService => {
    if (!baseUrl) throw new Error('baseUrl is required')

    const existingInstance = IndexerApiService.instances.get(baseUrl)
    if (existingInstance === undefined) {
      const newServiceInstance = new IndexerApiService(baseUrl)
      IndexerApiService.instances.set(baseUrl, newServiceInstance)

      return newServiceInstance
    }

    return existingInstance
  }

  public getStatus = async (): Promise<IndexerApiStatus> => {
    const response = await this.client.get(`api/v1/status`)

    return IndexerApiStatusSchema.parseAsync(response.data)
  }

  public getTransactions = async (params?: PaginationQuery): Promise<Transaction[]> => {
    const response = await this.client.get(`api/v1/transactions/`, { params })

    return TransactionSchema.array().parseAsync(response.data)
  }

  public getTransaction = async (hash: string): Promise<Transaction> => {
    const response = await this.client.get(`api/v1/transactions/${hash}`)

    return TransactionSchema.parseAsync(response.data)
  }

  public getInscriptions = async (params?: PaginationQuery): Promise<Inscription[]> => {
    const response = await this.client.get(`api/v1/inscriptions/`, { params })

    return InscriptionSchema.array().parseAsync(response.data)
  }

  public getInscriptionByHash = async (txHash: string): Promise<Inscription> => {
    const response = await this.client.get(`api/v1/inscriptions/${txHash}`)

    return InscriptionSchema.parseAsync(response.data)
  }

  public getOwnableInscriptions = async (walletAddress: string, params?: PaginationQuery): Promise<Inscription[]> => {
    const response = await this.client.get(`api/v1/users/${walletAddress}/inscriptions`, { params })

    return InscriptionSchema.array().parseAsync(response.data)
  }
}
