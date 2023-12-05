import type { NextPage } from 'next'
import Head from 'next/head'

import { MintInsc721Form } from '~/components/insc-721/MintInsc721Form'

const MintPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create an Inscription - NFT</title>
      </Head>

      <main>
        <MintInsc721Form />
      </main>
    </>
  )
}

export default MintPage
