import type { NextPage } from 'next'
import Head from 'next/head'

import { TokenList } from '~/components/TokenList'
import WalletHeader from '~/components/wallet/WalletHeader'

const OwnableInsc20Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>View your tokens</title>
      </Head>

      <WalletHeader />

      <main>
        <TokenList />
      </main>
    </>
  )
}

export default OwnableInsc20Page
