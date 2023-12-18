import type { NextPage } from 'next'
import Head from 'next/head'

import AllTokensHeader from '~/components/AllTokensHeader'
import Insc20List from '~/components/insc-20/Insc20List'

const Insc20TokensPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>View All IRC-20s</title>
      </Head>

      <AllTokensHeader />

      <main>
        <Insc20List />
      </main>
    </>
  )
}

export default Insc20TokensPage
