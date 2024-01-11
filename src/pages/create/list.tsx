import type { NextPage } from 'next'
import Head from 'next/head'
import { CreateListForm } from '~/components/create/CreateListForm'
import CreateHeader from '~/components/create/CreateHeader'

const CreateListPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create an Inscription - List</title>
      </Head>

      <CreateHeader />

      <main>
        <CreateListForm />
      </main>
    </>
  )
}

export default CreateListPage
