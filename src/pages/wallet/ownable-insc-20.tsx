import type { NextPage } from 'next'
import Head from 'next/head'

import WalletHeader from '~/components/wallet/WalletHeader'

const OwnableInsc20Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>View your inscriptions - Coin</title>
      </Head>

      <WalletHeader />

      <main></main>
    </>
  )
}

export default OwnableInsc20Page
