import type { NextPage } from 'next'
import Head from 'next/head'

import { Insc721Wallet } from '~/components/insc-721/Insc721Wallet'
import Insc721Header from '~/components/insc-721/Insc721Header'

const WalletPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>View your inscriptions - NFT</title>
      </Head>

      <Insc721Header />

      <main>
        <Insc721Wallet />
      </main>
    </>
  )
}

export default WalletPage
