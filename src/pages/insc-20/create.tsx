import type { NextPage } from 'next'
import Head from 'next/head'

import { CreateInsc20Form } from '~/components/create/CreateInsc20Form'
import Insc20Header from '~/components/insc-20/Insc20Header'

const CreatePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create an Inscription - IRC-20</title>
      </Head>

      <Insc20Header />

      <main>
        <CreateInsc20Form />
      </main>
    </>
  )
}

export default CreatePage
