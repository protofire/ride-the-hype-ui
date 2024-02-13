import type { NextPage } from 'next'
import Head from 'next/head'

import Insc20List from '~/components/insc-20/Insc20List'

const Insc20TokensPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>View All Tokens</title>
      </Head>

      <main>
        <Insc20List title={'Explore All Tokens'} />
      </main>
    </>
  )
}

export default Insc20TokensPage
