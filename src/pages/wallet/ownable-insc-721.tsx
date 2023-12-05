import type { NextPage } from 'next'
import Head from 'next/head'

import OwnableInsc721 from '~/components/wallet/OwnableInsc721'

const OwnableInsc721Page: NextPage = () => {
  return (
    <>
      <Head>
        <title>View your inscriptions</title>
      </Head>

      <main>
        <OwnableInsc721 />
      </main>
    </>
  )
}

export default OwnableInsc721Page
