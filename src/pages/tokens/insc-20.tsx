import type { NextPage } from 'next'
import Head from 'next/head'

import AllTokensHeader from '~/components/AllTokensHeader'
import Insc20List from '~/components/insc-20/Insc20List'
import { useCallback } from 'react'
import { IndexerApiService } from '~/services/indexer-api'

const Insc20TokensPage: NextPage = () => {
  const fetchTokens = useCallback(async (page: number, limit: number) => {
    const indexerApiService = IndexerApiService.getInstance()
    return indexerApiService.tokensModule.getAllInsc20({ page, limit, order: 'desc' })
  }, [])

  return (
    <>
      <Head>
        <title>View All IRC-20s</title>
      </Head>

      <AllTokensHeader />

      <main>
        <Insc20List fetchTokens={fetchTokens} />
      </main>
    </>
  )
}

export default Insc20TokensPage
