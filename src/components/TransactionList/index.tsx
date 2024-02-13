import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
// import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import RefreshIcon from '@mui/icons-material/Refresh'
import Button from '@mui/material/Button'

import useAsync from '~/hooks/useAsync'
import type { Transaction } from '~/services/indexer-api/types'
import { IndexerApiService } from '~/services/indexer-api'

import css from './styles.module.css'
import EthHashInfo from '~/components/common/EthHashInfo'
import Link from 'next/link'
import { useCurrentChain } from '~/hooks/useChains'
import ContentPaper from '../common/ContentPaper'

const PAGE_SIZE = 12

export const TransactionList = () => {
  const [counter, setCounter] = useState<number>(0)
  const [inscriptions, setInscriptions] = useState([] as Transaction[])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const currentChain = useCurrentChain()

  const [newInscriptions, error, loading] = useAsync(async () => {
    const indexerApiService = IndexerApiService.getInstance(currentChain)
    const data = await indexerApiService.getTransactions({ page, limit: PAGE_SIZE, order: 'desc' })

    setHasMore(!(data && data.length < PAGE_SIZE))

    return data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, counter, currentChain])

  // Add new inscriptions to the accumulated list
  useEffect(() => {
    if (newInscriptions && newInscriptions.length > 0) {
      setInscriptions((prev) => prev.concat(newInscriptions))
    }
  }, [newInscriptions])

  const refresh = () => {
    setInscriptions([])
    setHasMore(true)
    setPage(1)
    setCounter((prevState) => prevState + 1)
  }

  return (
    <ContentPaper title="Explore All Inscriptions">
      <div className={css.refreshContainer}>
        <Button variant="text" onClick={refresh} size="small" endIcon={<RefreshIcon />}>
          Refresh
        </Button>
      </div>

      {loading && inscriptions.length === 0 ? (
        <Grid container direction="row" spacing={3} mb={2}>
          {[...Array(PAGE_SIZE)].map((element, index) => (
            <Grid item lg={3} xs={6} key={`${element}-${index}`}>
              <Skeleton width="100%" height="250px" variant="rounded" />
            </Grid>
          ))}
        </Grid>
      ) : null}

      {error ? <Typography>An error occurred during loading inscriptions...</Typography> : null}

      {!loading && inscriptions !== undefined && inscriptions.length === 0 ? (
        <Typography>There are not any inscriptions yet.</Typography>
      ) : null}

      <InfiniteScroll
        dataLength={inscriptions.length}
        next={() => setPage((page) => page + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        height={'62vh'}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>You have seen it all</b>
          </p>
        }
      >
        <div className={css.gridContainer}>
          {inscriptions.map((item, index) => (
            <Link key={index} href={`/inscription?hash=${item.hash}`}>
              <div className={css.jsonItem}>
                <pre>{JSON.stringify(item.data, null, 2)}</pre>

                <EthHashInfo address={item.hash} showCopyButton hasExplorer />
                <Typography color="secondary" fontSize="0.6rem" mt="0.25rem">
                  Created at {new Date(Number(item.createdAt) * 1000).toLocaleString()}
                </Typography>
              </div>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
      <div />
    </ContentPaper>
  )
}
