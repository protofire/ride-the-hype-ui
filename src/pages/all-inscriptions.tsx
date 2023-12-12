import { useCallback } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'

import { Insc721List } from '~/components/insc-721/Insc721List'
import { IndexerApiService } from '~/services/indexer-api'

const AllInscriptionsPage: NextPage = () => {
  const fetchInscriptions = useCallback((page: number, limit: number) => {
    const api = IndexerApiService.getInstance()
    return api.getInscriptions({ page, limit, order: 'desc' })
  }, [])

  return (
    <>
      <Head>
        <title>Recent inscriptions</title>
      </Head>

      <main>
        <Insc721List fetchInscriptions={fetchInscriptions} />
      </main>
    </>
  )
}

export default AllInscriptionsPage
