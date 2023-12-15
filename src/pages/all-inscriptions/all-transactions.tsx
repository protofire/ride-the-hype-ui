import type { NextPage } from 'next'
import Head from 'next/head'

import AllInscriptionsHeader from '~/components/AllInscriptionsHeader'
import { TransactionList } from '~/components/TransactionList'

const LatestTransactionsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Latest Inscriptions</title>
      </Head>

      <AllInscriptionsHeader />

      <main>
        <TransactionList />
      </main>
    </>
  )
}

export default LatestTransactionsPage
