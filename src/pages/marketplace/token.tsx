import type { NextPage } from 'next'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import LocalNavHeader from '~/components/LocalNavHeader'
import { ConnectWalletPaper } from '~/components/common/ConnectWallet/ConnectWalletPaper'
import ActivityTable from '~/components/marketplace/ActivityTable'
// import { ListedScroll } from '~/components/marketplace/ListedInscription'
import { ListedToken } from '~/components/marketplace/ListedToken'
import { useCurrentChain } from '~/hooks/useChains'
import useWallet from '~/hooks/wallets/useWallet'
import { IndexerApiService } from '~/services/indexer-api'
import type { MarketplaceOrderList } from '~/services/indexer-api/modules/marketplace/types'
import type { OrderParams } from '~/services/indexer-api/types'

const TEMP_ETH_PRICE = 2263

const navTitles = [
  'Tokens',
  // 'Inscriptions',
  'Activity',
  'My Orders',
]

const MarketplaceTokenPage: NextPage = () => {
  const searchParams = useSearchParams()
  const currentChain = useCurrentChain()
  const ticker = searchParams.get('ticker')
  const wallet = useWallet()

  const fetchMarketplaceOrdersData = useCallback(
    async (params: OrderParams): Promise<MarketplaceOrderList> => {
      if (!params.tick) {
        return { list: [], count: 0 }
      }
      const indexerApiService = IndexerApiService.getInstance(currentChain)
      return indexerApiService.tokensModule.getMarketplaceDataByTick(params)
    },
    [currentChain],
  )

  const navContent: JSX.Element[] = [
    <ListedToken key={0} tick={ticker ?? ''} fetchMarketplaceOrdersData={fetchMarketplaceOrdersData} />,
    <ActivityTable key={1} tick={ticker ?? ''} fetchMarketplaceOrdersData={fetchMarketplaceOrdersData} />,
    wallet?.address ? (
      <ActivityTable
        key={2}
        tick={ticker ?? ''}
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
      <LocalNavHeader title={`${ticker} Token`} navTitles={navTitles} navContent={navContent} />
    </>
  )
}

export default MarketplaceTokenPage
