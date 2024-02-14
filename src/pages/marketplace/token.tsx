import { Stack } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
// import LocalNavHeader from '~/components/LocalNavHeader'
import { ConnectWalletPaper } from '~/components/common/ConnectWallet/ConnectWalletPaper'
import ContentPaper from '~/components/common/ContentPaper'
import TabsButton from '~/components/common/TabsButton'
import ActivityTable from '~/components/marketplace/ActivityTable'
// import { ListedScroll } from '~/components/marketplace/ListedInscription'
import { ListedToken } from '~/components/marketplace/ListedToken'
import { useCurrentChain } from '~/hooks/useChains'
import useWallet from '~/hooks/wallets/useWallet'
import { IndexerApiService } from '~/services/indexer-api'
import type { MarketplaceOrderList } from '~/services/indexer-api/modules/marketplace/types'
import type { OrderParams } from '~/services/indexer-api/types'

const navTitles: [string, string, string] = ['Tokens', 'Activity', 'My Orders']

const MarketplaceTokenPage: NextPage = () => {
  const searchParams = useSearchParams()
  const currentChain = useCurrentChain()
  const ticker = searchParams.get('ticker')
  const wallet = useWallet()
  const [selectedContent, setSelectedContent] = useState(0)

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
      {/* <LocalNavHeader title={`${ticker} Token`} navTitles={navTitles} navContent={navContent} /> */}
      <main>
        <ContentPaper title={`${ticker} Token`}>
          <Stack direction="row" justifyContent={'space-between'} sx={{ mb: 3 }}>
            <TabsButton
              titles={navTitles}
              onClick={(selected) => {
                setSelectedContent(selected)
              }}
            />
          </Stack>
          {navContent[selectedContent]}
        </ContentPaper>
      </main>
    </>
  )
}

export default MarketplaceTokenPage
