import { Stack, Tooltip, Button } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useState } from 'react'
import { ConnectWalletPaper } from '~/components/common/ConnectWallet/ConnectWalletPaper'
import ContentPaper from '~/components/common/ContentPaper'
import TabsButton from '~/components/common/TabsButton'
import ActivityTable from '~/components/marketplace/ActivityTable'
import MarketplaceTable from '~/components/marketplace/MarketplaceTable'
import { useCurrentChain } from '~/hooks/useChains'
import useWallet from '~/hooks/wallets/useWallet'
import { IndexerApiService } from '~/services/indexer-api'
import type { MarketplaceList, MarketplaceOrderList } from '~/services/indexer-api/modules/marketplace/types'
import type { OrderParams } from '~/services/indexer-api/types'
import InfoIcon from '@mui/icons-material/Info'

const navTitles: [string, string] = ['Listings', 'My Orders']

const MarketplacePage: NextPage = () => {
  const currentChain = useCurrentChain()
  const wallet = useWallet()
  const [selectedContent, setSelectedContent] = useState(0)

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
    <MarketplaceTable key={0} fetchMarketplaceData={fetchMarketplaceData} title="Marketplace" />,
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
      <main>
        {/* TODO: move to a separate tabbed component */}
        <ContentPaper title={'Marketplace'}>
          <Stack direction="row" justifyContent={'space-between'} sx={{ mb: 3 }}>
            <TabsButton
              titles={navTitles}
              onClick={(selected) => {
                setSelectedContent(selected)
              }}
            />
            <Tooltip title="List tokens in your balance page">
              <Button
                sx={{ borderRadius: '36px' }}
                variant="outlined"
                size="small"
                href={'/wallet'}
                startIcon={<InfoIcon />}
              >
                List
              </Button>
            </Tooltip>
          </Stack>
          {navContent[selectedContent]}
        </ContentPaper>
      </main>
    </>
  )
}

export default MarketplacePage
