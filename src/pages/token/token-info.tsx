import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback } from 'react'
import { IndexerApiService } from '~/services/indexer-api'
import { useSearchParams } from 'next/navigation'
import TokenOverview from '~/components/TokenList/TokenOverview'
import GeneralHeader from '~/components/GeneralHeader'
import { useCurrentChain } from '~/hooks/useChains'

const TokenInfoPage: NextPage = () => {
  const searchParams = useSearchParams()
  const ticker = searchParams.get('ticker')
  const currentChain = useCurrentChain()

  const fetchToken = useCallback(
    async (ticker: string) => {
      const indexerApiService = IndexerApiService.getInstance(currentChain)
      return indexerApiService.tokensModule.getInsc20ByTick(ticker)
    },
    [currentChain],
  )

  const fetchHolders = useCallback(
    async (ticker: string, page: number, limit: number) => {
      const indexerApiService = IndexerApiService.getInstance(currentChain)
      return indexerApiService.tokensModule.getHoldersByTick(ticker, { page, limit, order: 'desc' })
    },
    [currentChain],
  )

  const fetchTransactions = useCallback(
    async (ticker: string, page: number, limit: number) => {
      const indexerApiService = IndexerApiService.getInstance(currentChain)
      return indexerApiService.tokensModule.getTransactionsByTick(ticker, { page, limit, order: 'desc' })
    },
    [currentChain],
  )

  return (
    <>
      <Head>
        <title>{ticker} Token Overview</title>
      </Head>
      <GeneralHeader title={ticker + ' Token Overview'} navItems={[]} />

      <main>
        <TokenOverview
          ticker={ticker ?? ''}
          fetchToken={fetchToken}
          fetchHolders={fetchHolders}
          fetchTransactions={fetchTransactions}
        />
      </main>
    </>
  )
}

export default TokenInfoPage
