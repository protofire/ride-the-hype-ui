import type { NextPage } from 'next'
import Head from 'next/head'

import WalletHeader from '~/components/wallet/WalletHeader'

const OwnableInsc721Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>View your inscriptions - NFT</title>
      </Head>

      <WalletHeader />

      <main></main>
    </>
  )
}

export default OwnableInsc721Page
