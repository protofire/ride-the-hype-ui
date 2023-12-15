import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import InfiniteScroll from 'react-infinite-scroll-component'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { Skeleton, Typography } from '@mui/material'
import useAsync from '~/hooks/useAsync'
import { AppRoutes } from '~/config/routes'
import type { Inscription } from '~/services/indexer-api/types'
import css from './styles.module.css'

const PAGE_SIZE = 12

export const Insc721List = ({
  fetchInscriptions,
}: {
  fetchInscriptions: (page: number, limit: number) => Promise<Inscription[]> | undefined
}) => {
  const router = useRouter()

  const [inscriptions, setInscriptions] = useState([] as Inscription[])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  const [newInscriptions, error, loading] = useAsync(async () => {
    if (!!fetchInscriptions) {
      const data = await fetchInscriptions(page, PAGE_SIZE)

      setHasMore(!(data && data.length < PAGE_SIZE))

      return data
    }
  }, [fetchInscriptions, page])

  // Add new inscriptions to the accumulated list
  useEffect(() => {
    if (newInscriptions && newInscriptions.length > 0) {
      setInscriptions((prev) => prev.concat(newInscriptions))
    }
  }, [newInscriptions])

  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      {loading ? (
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
        loader={null}
      >
        <Grid container direction="row" spacing={0} mb={2}>
          {inscriptions.map((item) => {
            const href = { pathname: AppRoutes.insc721.inscriptionDetails, query: { id: item.hash } }
            return (
              <Grid item lg={3} xs={6} key={item.id + item.hash} className={css.item}>
                <div className={css.itemInner} onClick={() => router.push(href)}>
                  <Link href={href}>
                    <img
                      src={item.contentType === 'application/json' ? '/images/json-file.svg' : item.content}
                      alt={item.hash}
                      className={css.img}
                    />
                  </Link>
                </div>
              </Grid>
            )
          })}
        </Grid>
      </InfiniteScroll>
      <div />
    </Paper>
  )
}
