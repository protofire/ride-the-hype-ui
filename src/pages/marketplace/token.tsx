import { Typography } from '@mui/material'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import LocalNavHeader from '~/components/LocalNavHeader'
import ActivityTable from '~/components/marketplace/ActivityTable'
// import { ListedScroll } from '~/components/marketplace/ListedInscription'
import { ListedToken } from '~/components/marketplace/ListedToken'
import { ZERO_ADDRESS } from '~/config/constants'
import { useCurrentChain } from '~/hooks/useChains'
import { IndexerApiService } from '~/services/indexer-api'
import type { MarketplaceActivity, MarketplaceOrder } from '~/services/indexer-api/modules/marketplace/types'

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

  const fetchMarketplaceActivityData = useCallback(
    async (page: number, limit: number): Promise<MarketplaceActivity[]> => {
      return new Promise((resolve) => {
        const data: MarketplaceActivity[] = Array.from({ length: 57 }, (v, i) => {
          const events = ['listing', 'sold', 'cancelled']
          const price = i % 2 === 0 ? Math.random() * 1000 : 100
          const amount = Math.floor(Math.random() * 100)
          return {
            hash: ZERO_ADDRESS,
            event: events[Math.floor(Math.random() * events.length)],
            tick: ticker ?? '',
            price: i % 2 === 0 ? Math.random() * 1000 : 100,
            amount: Math.floor(Math.random() * 100),
            total: price / TEMP_ETH_PRICE,
            from: ZERO_ADDRESS,
            to: ZERO_ADDRESS,
            time: 0,
          }
        })
        resolve(data)
      })
    },
    [ticker],
  )

  const fetchMarketplaceDataByTick = useCallback(
    async (ticker: string, page: number, limit: number): Promise<MarketplaceOrder[]> => {
      const indexerApiService = IndexerApiService.getInstance(currentChain)
      return indexerApiService.tokensModule.getMarketplaceDataByTick(ticker, { page, limit })
    },
    [currentChain],
  )

  const navContent: JSX.Element[] = [
    <ListedToken key={0} ticker={ticker ?? ''} fetchMarketplaceDataByTick={fetchMarketplaceDataByTick} />,
    // <ListedScroll key={1} ticker={ticker ?? ''} />,
    <ActivityTable key={1} fetchMarketplaceActivityData={fetchMarketplaceActivityData} />,
    <Typography key={2}>{navTitles[2]}</Typography>,
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
