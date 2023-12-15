import type { NextPage } from 'next'
import Head from 'next/head'
import CreateHeader from '~/components/create/CreateHeader'
import { CreateInsc20Form } from '~/components/create/CreateInsc20Form'

const CreateInsc20Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create an Inscription - IRC-20</title>
      </Head>

      <CreateHeader />

      <main>
        <CreateInsc20Form />
      </main>
    </>
  )
}

export default CreateInsc20Page
