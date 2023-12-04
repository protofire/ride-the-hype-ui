import { Axios } from 'axios'

import { DEFAULT_INDEXER_API_BASE_URL } from '~/config/constants'
import { InscriptionSchema } from '~/services/indexer-api/validators'
import type { Inscription } from '~/services/indexer-api/types'
import { transformAxiosResponse as transformResponse } from '~/utils'

export class IndexerApiService {
  private static instances = new Map<string, IndexerApiService>()

  private readonly client: Axios

  private constructor(baseURL: string) {
    this.client = new Axios({ baseURL, transformResponse })
  }

  public static getInstance = (baseUrl: string = DEFAULT_INDEXER_API_BASE_URL): IndexerApiService => {
    const existingInstance = IndexerApiService.instances.get(baseUrl)
    if (existingInstance === undefined) {
      const newServiceInstance = new IndexerApiService(baseUrl)
      IndexerApiService.instances.set(baseUrl, newServiceInstance)

      return newServiceInstance
    }

    return existingInstance
  }

  public getOwnableInscriptions = async (walletAddress: string): Promise<Inscription[]> => {
    const response = await this.client.get(`api/v1/users/${walletAddress}/inscriptions`)

    console.log({ response })
    return InscriptionSchema.array().parseAsync(response.data)
  }
}
