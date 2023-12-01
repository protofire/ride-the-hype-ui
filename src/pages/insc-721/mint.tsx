import type { NextPage } from 'next'
import Head from 'next/head'

import { MintInsc721Form } from '~/components/insc-721/MintInsc721Form'
import Insc721Header from '~/components/insc-721/Insc721Header'

const MintPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create an Inscription - NFT</title>
      </Head>

      <Insc721Header />

      <main>
        <MintInsc721Form />
      </main>
    </>
  )
}

export default MintPage
