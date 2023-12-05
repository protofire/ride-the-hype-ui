import type { NextPage } from 'next'
import Head from 'next/head'
import Inscription from '~/components/insc-721/Inscription'

const InscriptionDetails: NextPage = () => {
  return (
    <>
      <Head>
        <title>View Inscription - NFT details</title>
      </Head>

      <main>
        <Inscription />
      </main>
    </>
  )
}

export default InscriptionDetails
