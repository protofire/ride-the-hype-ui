import type { NextPage } from 'next'
import Head from 'next/head'

import AllInscriptionsHeader from '~/components/AllInscriptionsHeader'
import { TransactionList } from '~/components/TransactionList'
import { useCallback } from 'react'
import { IndexerApiService } from '~/services/indexer-api'

const AllInsc20Page: NextPage = () => {
  const fetchInscriptions = useCallback(async (page: number, limit: number) => {
    const indexerApiService = IndexerApiService.getInstance()
    return indexerApiService.getTransactions({ page, limit, order: 'desc' })
  }, [])

  return (
    <>
      <Head>
        <title>Latest Inscriptions</title>
      </Head>

      <AllInscriptionsHeader />

      <main>
        <TransactionList fetchInscriptions={fetchInscriptions} />
      </main>
    </>
  )
}

export default AllInsc20Page
