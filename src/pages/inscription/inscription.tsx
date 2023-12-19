import type { NextPage } from 'next'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
// import InscriptionHeader from '~/components/InscriptionHeader'
import TransactionOverview from '~/components/TransactionList/TransactionOverview'
import { IndexerApiService } from '~/services/indexer-api'
import { useCallback } from 'react'

const InscriptionPage: NextPage = () => {
  const searchParams = useSearchParams()
  const hash = searchParams.get('hash')

  const fetchTransaction = useCallback(async (hash: string) => {
    const indexerApiService = IndexerApiService.getInstance()
    return indexerApiService.getTransaction(hash)
  }, [])

  const fetchToken = useCallback(async (ticker: string) => {
    const indexerApiService = IndexerApiService.getInstance()
    return indexerApiService.tokensModule.getInsc20ByTick(ticker)
  }, [])

  return (
    <>
      <Head>
        <title>Inscription Overview</title>
      </Head>
      {/* <InscriptionHeader /> */}
      <main>
        <TransactionOverview hash={hash ?? ''} fetchTransaction={fetchTransaction} fetchToken={fetchToken} />
      </main>
    </>
  )
}
export default InscriptionPage
