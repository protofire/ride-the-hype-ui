import type { NextPage } from 'next'
import Head from 'next/head'

import AllTokensHeader from '~/components/AllTokensHeader'
import { useCallback } from 'react'
import { IndexerApiService } from '~/services/indexer-api'
import { Insc721List } from '~/components/insc-721/Insc721List'
import { useCurrentChain } from '~/hooks/useChains'

const AllInsc721Page: NextPage = () => {
  const currentChain = useCurrentChain()
  const fetchInscriptions = useCallback(
    (page: number, limit: number) => {
      const api = IndexerApiService.getInstance(currentChain)
      return api.getInscriptions({ page, limit, order: 'desc' })
    },
    [currentChain],
  )

  return (
    <>
      <Head>
        <title>View All IRC-721s</title>
      </Head>

      <AllTokensHeader />

      <main>
        <Insc721List fetchInscriptions={fetchInscriptions} />
      </main>
    </>
  )
}

export default AllInsc721Page
