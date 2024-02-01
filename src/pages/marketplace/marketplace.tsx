import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback } from 'react'
import GeneralHeader from '~/components/GeneralHeader'
import MarketplaceTable from '~/components/marketplace/MarketplaceTable'
import { marketplaceNavItems } from '~/components/sidebar/SidebarNavigation/config'
import { useCurrentChain } from '~/hooks/useChains'
import { IndexerApiService } from '~/services/indexer-api'
import type { MarketplaceList } from '~/services/indexer-api/modules/marketplace/types'

export const TEMP_ETH_PRICE = 2225

const MarketplacePage: NextPage = () => {
  const currentChain = useCurrentChain()

  const fetchMarketplaceData = useCallback(
    async (page: number, limit: number): Promise<MarketplaceList> => {
      const indexerApiService = IndexerApiService.getInstance(currentChain)
      return indexerApiService.tokensModule.getMarketplaceData({ page, limit })
    },
    [currentChain],
  )

  return (
    <>
      <Head>
        <title>Marketplace</title>
      </Head>
      <GeneralHeader title={'Marketplace'} navItems={marketplaceNavItems} />

      <main>
        <MarketplaceTable fetchMarketplaceData={fetchMarketplaceData} />
      </main>
    </>
  )
}

export default MarketplacePage
