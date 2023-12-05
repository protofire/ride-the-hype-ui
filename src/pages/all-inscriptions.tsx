import type { NextPage } from 'next'
import Head from 'next/head'

import AllInscriptions from '~/components/all-inscriptions'

const AllInscriptionsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>All inscriptions</title>
      </Head>

      <main>
        <AllInscriptions />
      </main>
    </>
  )
}

export default AllInscriptionsPage
