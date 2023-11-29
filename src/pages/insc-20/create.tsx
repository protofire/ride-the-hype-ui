import type { NextPage } from 'next'
import Head from 'next/head'

import { CreateInsc20Form } from '~/components/insc-20/CreateInsc20Form'
import Insc20Header from '~/components/insc-20/Insc20Header'

const CreatePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create an Inscription - Coin</title>
      </Head>

      <Insc20Header />

      <main>
        <CreateInsc20Form />
      </main>
    </>
  )
}

export default CreatePage
