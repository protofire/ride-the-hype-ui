import type { NextPage } from 'next'
import Head from 'next/head'

import AllInscriptionsHeader from '~/components/AllInscriptionsHeader'
import Insc20List from '~/components/insc-20/Insc20List'
import { useCallback } from 'react'
import { IndexerApiService } from '~/services/indexer-api'

const AllInsc20Page: NextPage = () => {
  const fetchTokens = useCallback(async (page: number, limit: number) => {
    const indexerApiService = IndexerApiService.getInstance()
    return indexerApiService.tokensModule.getAllInsc20({ page, limit, order: 'desc' })
  }, [])

  return (
    <>
      <Head>
        <title>View All IRC-20s</title>
      </Head>

      <AllInscriptionsHeader />

      <main>
        <Insc20List fetchTokens={fetchTokens} />
      </main>
    </>
  )
}

export default AllInsc20Page
