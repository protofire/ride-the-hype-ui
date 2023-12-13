import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback } from 'react'
import { Insc721List } from '~/components/insc-721/Insc721List'

import useWallet from '~/hooks/wallets/useWallet'
import { IndexerApiService } from '~/services/indexer-api'
import WalletHeader from '~/components/wallet/WalletHeader'

const OwnableInsc721Page: NextPage = () => {
  const wallet = useWallet()

  const fetchInscriptions = useCallback(
    (page: number, limit: number) => {
      if (wallet) {
        const api = IndexerApiService.getInstance()

        return api.getOwnableInscriptions(wallet.address, { page, limit, order: 'desc' })
      }
    },
    [wallet],
  )

  return (
    <>
      <Head>
        <title>View your IRC-721s</title>
      </Head>

      <WalletHeader />

      <main>
        <Insc721List fetchInscriptions={fetchInscriptions} />
      </main>
    </>
  )
}

export default OwnableInsc721Page
