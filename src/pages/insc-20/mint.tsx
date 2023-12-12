import type { NextPage } from 'next'
import Head from 'next/head'

import { MintInsc20Form } from '~/components/insc-20/MintInsc20Form'
import Insc20Header from '~/components/insc-20/Insc20Header'

const MintPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Mint an Inscription - IRC-20</title>
      </Head>

      <Insc20Header />

      <main>
        <MintInsc20Form />
      </main>
    </>
  )
}

export default MintPage
