import type { NextPage } from 'next'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import TransactionOverview from '~/components/TransactionList/TransactionOverview'
import { IndexerApiService } from '~/services/indexer-api'
import { useCallback } from 'react'
import GeneralHeader from '~/components/GeneralHeader'
import { useCurrentChain } from '~/hooks/useChains'

const InscriptionPage: NextPage = () => {
  const searchParams = useSearchParams()
  const hash = searchParams.get('hash')
  const currentChain = useCurrentChain()

  const fetchTransaction = useCallback(
    async (hash: string) => {
      const indexerApiService = IndexerApiService.getInstance(currentChain)
      return indexerApiService.getTransaction(hash)
    },
    [currentChain],
  )

  const fetchToken = useCallback(
    async (ticker: string) => {
      const indexerApiService = IndexerApiService.getInstance(currentChain)
      return indexerApiService.tokensModule.getInsc20ByTick(ticker)
    },
    [currentChain],
  )

  return (
    <>
      <Head>
        <title>Inscription Overview</title>
      </Head>
      <GeneralHeader navItems={[]} title="Inscription Overview" />
      <main>
        <TransactionOverview hash={hash ?? ''} fetchTransaction={fetchTransaction} fetchToken={fetchToken} />
      </main>
    </>
  )
}
export default InscriptionPage
