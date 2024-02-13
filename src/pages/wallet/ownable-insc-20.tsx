import type { NextPage } from 'next'
import Head from 'next/head'

import { TokenList } from '~/components/TokenList'

const OwnableInsc20Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>View your tokens</title>
      </Head>

      <main>
        <TokenList title={'Your tokens'} />
      </main>
    </>
  )
}

export default OwnableInsc20Page
