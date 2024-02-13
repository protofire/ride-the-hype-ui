import type { NextPage } from 'next'
import Head from 'next/head'
import { useCallback, useState } from 'react'
import { IndexerApiService } from '~/services/indexer-api'
import { useSearchParams } from 'next/navigation'
import TokenOverview from '~/components/TokenList/TokenOverview'
import { useCurrentChain } from '~/hooks/useChains'
import ContentPaper from '~/components/common/ContentPaper'
import TabsButton from '~/components/common/TabsButton'
import HoldersTable from '~/components/TokenList/HoldersTable'
import TransactionsTable from '~/components/TokenList/TransactionsTable'
import useAsync from '~/hooks/useAsync'

const TokenInfoPage: NextPage = () => {
  const searchParams = useSearchParams()
  const ticker = searchParams.get('ticker')
  const currentChain = useCurrentChain()
  const [selectedContent, setSelectedContent] = useState(0)

  const fetchToken = useCallback(
    async (ticker: string) => {
      const indexerApiService = IndexerApiService.getInstance(currentChain)
      return indexerApiService.tokensModule.getInsc20ByTick(ticker)
    },
    [currentChain],
  )

  const [tokenData, error, loading] = useAsync(async () => {
    if (!!fetchToken && !!ticker) {
      try {
        const data = await fetchToken(ticker)
        data.createdAt = new Date(Number(data.createdAt) * 1000).toLocaleString()
        data.completedAt = data.completedAt ? new Date(Number(data.completedAt) * 1000).toLocaleString() : null
        const updatedObject = {
          ...data,
          progress: data.progress ? +(+data.progress * 100).toFixed(2) : 0,
          badges: data.badge ? data.badge?.split(',') : [],
        }
        return updatedObject
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchToken, ticker])

  const fetchHolders = useCallback(
    async (ticker: string, page: number, limit: number) => {
      const indexerApiService = IndexerApiService.getInstance(currentChain)
      return indexerApiService.tokensModule.getHoldersByTick(ticker, { page, limit, order: 'desc' })
    },
    [currentChain],
  )

  const fetchTransactions = useCallback(
    async (ticker: string, page: number, limit: number) => {
      const indexerApiService = IndexerApiService.getInstance(currentChain)
      return indexerApiService.tokensModule.getTransactionsByTick(ticker, { page, limit, order: 'desc' })
    },
    [currentChain],
  )

  const navTitles = ['Overview', 'Holders', 'Events']

  const navContent = [
    <TokenOverview key={0} ticker={ticker ?? ''} tokenData={tokenData} loading={loading} error={error} />,
    <HoldersTable
      key={1}
      ticker={ticker ?? ''}
      fetchHolders={fetchHolders}
      totalHolders={tokenData?.holders ?? 0}
      maxSupply={tokenData?.maxSupply ?? 0}
    />,
    <TransactionsTable
      key={2}
      ticker={ticker ?? ''}
      fetchTransactions={fetchTransactions}
      totalTransactions={tokenData?.transactions ?? 0}
    />,
  ]

  return (
    <>
      <Head>
        <title>{ticker} Token Overview</title>
      </Head>
      <main>
        <ContentPaper title={`${ticker ?? ''} Token`}>
          <TabsButton
            titles={navTitles}
            onClick={(selected) => {
              setSelectedContent(selected)
            }}
          />

          {navContent[selectedContent]}
        </ContentPaper>
      </main>
    </>
  )
}

export default TokenInfoPage
