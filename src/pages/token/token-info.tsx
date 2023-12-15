import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback } from 'react'
import { IndexerApiService } from '~/services/indexer-api'
import TokenHeader from '~/components/TokenHeader'
import { useSearchParams } from 'next/navigation'
import HoldersTable from '~/components/TokenList/HoldersTable'
import TransfersTable from '~/components/TokenList/TransfersTable'
import TokenOverview from '~/components/TokenList/TokenOverview'

const TokenInfoPage: NextPage = () => {
  const searchParams = useSearchParams()
  const ticker = searchParams.get('ticker')

  const fetchToken = useCallback(async (ticker: string) => {
    const indexerApiService = IndexerApiService.getInstance()
    return indexerApiService.tokensModule.getInsc20ByTick(ticker)
  }, [])

  return (
    <>
      <Head>
        <title>Token Overview</title>
      </Head>
      <TokenHeader ticker={ticker ?? ''} />

      <main>
        <TokenOverview ticker={ticker ?? ''} fetchToken={fetchToken} />
        <HoldersTable />
        <TransfersTable />
      </main>
    </>
  )
}

export default TokenInfoPage
