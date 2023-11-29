import type { ChainInfo } from '~/types'
import { chainsConfiguration } from '~/config/chains'

/**
 * A temporary mock function to get the chains' configuration.
 * @returns An object with the results of the chain information.
 */
export const getChainsConfig = (): { results: ChainInfo[] } => ({
  results: chainsConfiguration,
})
