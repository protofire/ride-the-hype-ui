import type { NextPage } from 'next'
import Head from 'next/head'
import { CreateCustomForm } from '~/components/create/CreateCustomForm'
import CreateHeader from '~/components/create/CreateHeader'

const CreateCustomPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create an Inscription - Custom</title>
      </Head>

      <CreateHeader />

      <main>
        <CreateCustomForm />
      </main>
    </>
  )
}

export default CreateCustomPage
