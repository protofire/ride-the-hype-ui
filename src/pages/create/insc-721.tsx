import type { NextPage } from 'next'
import Head from 'next/head'
import { MintInsc721Form } from '~/components/create/MintInsc721Form'
import CreateHeader from '~/components/create/CreateHeader'

const CreateInsc721Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create an Inscription - NFT</title>
      </Head>

      <CreateHeader />

      <main>
        <MintInsc721Form />
      </main>
    </>
  )
}

export default CreateInsc721Page
