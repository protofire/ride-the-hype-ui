import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback } from 'react'
import GeneralHeader from '~/components/GeneralHeader'
import MarketplaceTable from '~/components/marketplace/MarketplaceTable'
import { marketplaceNavItems } from '~/components/sidebar/SidebarNavigation/config'
import { useCurrentChain } from '~/hooks/useChains'
import { IndexerApiService } from '~/services/indexer-api'
import type { Marketplace, MarketplaceList } from '~/services/indexer-api/modules/marketplace/types'

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

  const fetchMockMarketplaceData = useCallback(async (page: number, limit: number): Promise<Marketplace[]> => {
    return new Promise((resolve) => {
      const data: Marketplace[] = Array.from({ length: 57 }, (v, i) => {
        const floorPrice = Math.random()
        const sales24h = Math.floor(Math.random() * (i % 2 === 0 ? 100 : 1000))
        const volume24h = (floorPrice / TEMP_ETH_PRICE) * sales24h

        const volumeAll = volume24h * 30
        const salesAll = sales24h * 30

        const listed = salesAll * (1 + Math.random())
        return {
          tick: `test${i}`,
          volume24h: volume24h,
          volumeAll: volumeAll,
          sales24h: sales24h,
          salesAll: salesAll,
          owners: listed * (1 + Math.random()),
          listed: listed,
          marketCap: volumeAll * TEMP_ETH_PRICE,
          floorPrice: Math.random(),
        }
      })
      resolve(data)
    })
  }, [])

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
