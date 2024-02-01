import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback } from 'react'
import LocalNavHeader from '~/components/LocalNavHeader'
import { ConnectWalletPaper } from '~/components/common/ConnectWallet/ConnectWalletPaper'
import ActivityTable from '~/components/marketplace/ActivityTable'
import MarketplaceTable from '~/components/marketplace/MarketplaceTable'
import { useCurrentChain } from '~/hooks/useChains'
import useWallet from '~/hooks/wallets/useWallet'
import { IndexerApiService } from '~/services/indexer-api'
import type { MarketplaceList, MarketplaceOrderList } from '~/services/indexer-api/modules/marketplace/types'
import type { OrderParams } from '~/services/indexer-api/types'

const navTitles = ['Listings', 'My Orders']

const MarketplacePage: NextPage = () => {
  const currentChain = useCurrentChain()
  const wallet = useWallet()

  const fetchMarketplaceData = useCallback(
    async (page: number, limit: number): Promise<MarketplaceList> => {
      const indexerApiService = IndexerApiService.getInstance(currentChain)
      return indexerApiService.tokensModule.getMarketplaceData({ page, limit })
    },
    [currentChain],
  )

  const fetchMarketplaceOrdersData = useCallback(
    async (params: OrderParams): Promise<MarketplaceOrderList> => {
      const indexerApiService = IndexerApiService.getInstance(currentChain)
      return indexerApiService.tokensModule.getMarketplaceDataByTick(params)
    },
    [currentChain],
  )

  const navContent: JSX.Element[] = [
    <MarketplaceTable key={0} fetchMarketplaceData={fetchMarketplaceData} />,
    wallet?.address ? (
      <ActivityTable
        key={2}
        tick={''}
        seller={wallet?.address}
        fetchMarketplaceOrdersData={fetchMarketplaceOrdersData}
      />
    ) : (
      <ConnectWalletPaper />
    ),
  ]

  return (
    <>
      <Head>
        <title>Marketplace</title>
      </Head>
      <LocalNavHeader title={`Marketplace`} navTitles={navTitles} navContent={navContent} />
    </>
  )
}

export default MarketplacePage
