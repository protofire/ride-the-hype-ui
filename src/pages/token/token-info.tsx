import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback } from 'react'
import { IndexerApiService } from '~/services/indexer-api'
import TokenHeader from '~/components/TokenHeader'
import { useSearchParams } from 'next/navigation'
import TokenOverview from '~/components/TokenList/TokenOverview'

const TokenInfoPage: NextPage = () => {
  const searchParams = useSearchParams()
  const ticker = searchParams.get('ticker')

  const fetchToken = useCallback(async (ticker: string) => {
    const indexerApiService = IndexerApiService.getInstance()
    return indexerApiService.tokensModule.getInsc20ByTick(ticker)
  }, [])

  const fetchHolders = useCallback(async (ticker: string, page: number, limit: number) => {
    const indexerApiService = IndexerApiService.getInstance()
    return indexerApiService.tokensModule.getHoldersByTick(ticker, { page, limit, order: 'desc' })
  }, [])

  const fetchTransactions = useCallback(async (ticker: string, page: number, limit: number) => {
    const indexerApiService = IndexerApiService.getInstance()
    return indexerApiService.tokensModule.getTransactionsByTick(ticker, { page, limit, order: 'desc' })
  }, [])

  return (
    <>
      <Head>
        <title>{ticker} Token Overview</title>
      </Head>
      <TokenHeader ticker={ticker ?? ''} />

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
