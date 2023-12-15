import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback } from 'react'
import { TokenList } from '~/components/TokenList'

import useWallet from '~/hooks/wallets/useWallet'
import { IndexerApiService } from '~/services/indexer-api'
import WalletHeader from '~/components/wallet/WalletHeader'

const OwnableInsc20Page: NextPage = () => {
  const wallet = useWallet()

  const getUserHoldings = useCallback(
    (page: number, limit: number) => {
      if (wallet) {
        const api = IndexerApiService.getInstance()

        return api.tokensModule.getUserHoldings(wallet.address, { page, limit, order: 'desc' })
      }
    },
    [wallet],
  )

  return (
    <>
      <Head>
        <title>View your tokens</title>
      </Head>

      <WalletHeader />

      <main>
        <TokenList getUserHoldings={getUserHoldings} />
      </main>
    </>
  )
}

export default OwnableInsc20Page
