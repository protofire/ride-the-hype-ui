import { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import RefreshIcon from '@mui/icons-material/Refresh'
import LinearProgress from '@mui/material/LinearProgress'
import type { Insc20 } from '~/services/indexer-api/types'
import useAsync from '~/hooks/useAsync'
import type { EnhancedTableProps } from '~/components/common/EnhancedTable'
import EnhancedTable from '~/components/common/EnhancedTable'
import { AppRoutes } from '~/config/routes'
import { IndexerApiService } from '~/services/indexer-api'

import { MintButton } from './MintButton'
import css from './styles.module.css'

const PAGE_SIZE = 100

const skeletonCells: EnhancedTableProps['rows'][0]['cells'] = {
  tick: {
    rawValue: '...',
    content: (
      <div className={css.token}>
        <Typography>
          <Skeleton width="80px" height="60px" />
        </Typography>
      </div>
    ),
  },
  createdAt: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="132px" height="60px" />
      </Typography>
    ),
  },
  progress: {
    rawValue: '0.00%',
    content: (
      <Typography>
        <Skeleton width="132px" height="60px" />
      </Typography>
    ),
  },
  holders: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" height="60px" />
      </Typography>
    ),
  },
  transactions: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" height="60px" />
      </Typography>
    ),
  },
  actions: {
    rawValue: '',
    sticky: true,
    content: <div></div>,
  },
}
const skeletonRows: EnhancedTableProps['rows'] = Array(25).fill({ cells: skeletonCells })

const headCells = [
  {
    id: 'tick',
    label: 'Ticker',
    width: '15%',
  },
  {
    id: 'createdAt',
    label: 'Deploy time',
    width: '25%',
  },
  {
    id: 'progress',
    label: 'Progress',
    width: '25%',
  },
  {
    id: 'holders',
    label: 'Holders',
    width: '10%',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    width: '10%',
  },
  {
    id: 'actions',
    label: '',
    width: '15%',
    sticky: true,
  },
]

const Insc20List = () => {
  const [counter, setCounter] = useState<number>(0)
  const [tokens, setTokens] = useState([] as Insc20[])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  const [newTokens, error, loading] = useAsync(async () => {
    const indexerApiService = IndexerApiService.getInstance()
    const data = await indexerApiService.tokensModule.getAllInsc20({ page, limit: PAGE_SIZE, order: 'desc' })

    setHasMore(!(data && data.length < PAGE_SIZE))

    return data
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, counter])

  // Add new tokens to the accumulated list
  useEffect(() => {
    if (newTokens && newTokens.length > 0) {
      setTokens((prev) => prev.concat(newTokens))
    }
  }, [newTokens])

  const refresh = () => {
    setTokens([])
    setHasMore(true)
    setPage(1)
    setCounter((prevState) => prevState + 1)
  }

  const rows = loading
    ? skeletonRows
    : (tokens || []).map((item) => {
        const progressValue = (Number(item.totalSupply) / Number(item.maxSupply)) * 100
        const createdAtDate = new Date(Number(item.createdAt) * 1000)

        return {
          key: item.id,
          href: AppRoutes.token.index + `?ticker=${item.tick}`,
          cells: {
            tick: {
              rawValue: item.tick,
              content: <Typography>{item.tick}</Typography>,
            },
            createdAt: {
              rawValue: createdAtDate.getTime(),
              content: <Typography>{createdAtDate.toLocaleString()}</Typography>,
            },
            progress: {
              rawValue: progressValue,
              content: (
                <Box display="flex" alignItems="center">
                  <Box width="100%" mr={1}>
                    <LinearProgress variant="determinate" value={progressValue} />
                  </Box>
                  <Box minWidth={35}>
                    <Typography variant="body2" color="textSecondary">{`${Math.round(progressValue)}%`}</Typography>
                  </Box>
                </Box>
              ),
            },
            holders: {
              rawValue: item.holders,
              content: <Typography>{item.holders}</Typography>,
            },
            transactions: {
              rawValue: item.transactions,
              content: <Typography>{item.transactions}</Typography>,
            },
            actions: {
              rawValue: '',
              sticky: true,
              content: (
                <Box display="flex" flexDirection="row" gap={1} alignItems="center">
                  {progressValue !== 100 ? (
                    <MintButton insc20={item} />
                  ) : (
                    <Typography color="error">Fully minted</Typography>
                  )}
                </Box>
              ),
            },
          },
        }
      })

  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      <div className={css.refreshContainer}>
        <Button variant="text" onClick={refresh} size="small" endIcon={<RefreshIcon />}>
          Refresh
        </Button>
      </div>

      {error ? <Typography>An error occurred during loading tokens...</Typography> : null}

      <div className={css.container}>
        <EnhancedTable rows={rows} headCells={headCells} />
      </div>
    </Paper>
  )
}

export default Insc20List
