import type { NextPage } from 'next'
import Head from 'next/head'
import { CreateCustomForm } from '~/components/create/CreateCustomForm'

const CreateCustomPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create an Inscription - Custom</title>
      </Head>

      <main>
        <CreateCustomForm title={'Create a brand new inscription'} />
      </main>
    </>
  )
}

export default CreateCustomPage
