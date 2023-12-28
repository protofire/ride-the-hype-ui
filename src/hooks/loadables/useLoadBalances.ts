import { useEffect } from 'react'
import useAsync, { type AsyncResult } from '~/hooks/useAsync'
import { logError } from '~/services/exceptions'
import { POLLING_INTERVAL } from '~/config/constants'
import useIntervalCounter from '../useIntervalCounter'
import useWallet from '~/hooks/wallets/useWallet'
import { IndexerApiService } from '~/services/indexer-api'
import type { Insc20Balance } from '~/services/indexer-api/types'

export const useLoadBalances = (): AsyncResult<{ insc20s: Insc20Balance[] }> => {
  const [pollCount, resetPolling] = useIntervalCounter(POLLING_INTERVAL)
  const wallet = useWallet()

  // Re-fetch assets when the wallet address/chainId updates
  const [insc20s, error, loading] = useAsync<Insc20Balance[]>(
    () => {
      if (!wallet || !wallet.address) return

      const indexerApiService = IndexerApiService.getInstance()
      return indexerApiService.tokensModule.getUserHoldings(wallet.address, { limit: 100 })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wallet?.address, wallet?.chainId, pollCount],
    false, // don't clear data between polls
  )

  // Reset the counter when wallet address/chainId changes
  useEffect(() => {
    resetPolling()
  }, [resetPolling, wallet?.address, wallet?.chainId])

  // Log errors
  useEffect(() => {
    if (error) {
      logError(error.message)
    }
  }, [error])

  return [insc20s ? { insc20s } : undefined, error, loading]
}

export default useLoadBalances
