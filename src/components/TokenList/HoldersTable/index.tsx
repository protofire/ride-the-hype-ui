import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import css from './styles.module.css'
import type { EnhancedTableProps } from '~/components/common/EnhancedTable'
import EnhancedTable from '~/components/common/EnhancedTable'
import type { TokenHolder } from '~/services/indexer-api/types'
import { useState } from 'react'
import useAsync from '~/hooks/useAsync'
import EthHashInfo from '~/components/common/EthHashInfo'
import { Box, LinearProgress } from '@mui/material'

const INITIAL_PAGE_SIZE = 5

const skeletonCells: EnhancedTableProps['rows'][0]['cells'] = {
  address: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" />
      </Typography>
    ),
  },
  percentage: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" />
      </Typography>
    ),
  },
  amount: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" />
      </Typography>
    ),
  },
}
const skeletonRows: EnhancedTableProps['rows'] = Array(INITIAL_PAGE_SIZE).fill({ cells: skeletonCells })

const headCells = [
  {
    id: 'holder',
    label: 'Holder',
  },
  {
    id: 'percentage',
    label: 'Percentage',
  },
  {
    id: 'amount',
    label: 'Amount',
  },
]

interface Props {
  fetchHolders: (ticker: string, page: number, limit: number) => Promise<TokenHolder[]> | undefined
  ticker: string
  totalHolders: number
  maxSupply: number | string
}

const HoldersTable = ({ fetchHolders, ticker, totalHolders, maxSupply }: Props) => {
  // const [holders, setHolders] = useState([] as TokenHolder[])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE)

  const [holders, error, loading] = useAsync(async () => {
    if (!!fetchHolders && totalHolders > 0) {
      try {
        const data = await fetchHolders(ticker, page + 1, pageSize) //in API page starts from 1, while in front-end - from 0
        const dataWithPercentage = data
          ? data.map((holder) => ({
              ...holder,
              percentage: (Number(holder.amount) / Number(maxSupply)) * 100,
            }))
          : []
        return dataWithPercentage
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchHolders, maxSupply, page, pageSize, ticker, totalHolders])

  // // Add new tokens to the accumulated list
  // useEffect(() => {
  //   if (newHolders && newHolders.length > 0) {
  //     // setHolders((prev) => prev.concat(newHolders))
  //     setHolders(newHolders)
  //   }
  // }, [newHolders])

  const rows = loading
    ? skeletonRows
    : (holders || []).map((item) => {
        return {
          key: item.address,
          cells: {
            address: {
              rawValue: item.address,
              content: (
                <Typography>
                  <EthHashInfo
                    shortAddress={false}
                    showCopyButton
                    address={item.address}
                    showPrefix={false}
                    hasExplorer
                    avatarSize={0}
                  />
                </Typography>
              ),
            },
            percentage: {
              rawValue: item.percentage,
              content: (
                <Box display="flex" alignItems="center">
                  <Box width="100%" mr={1}>
                    <LinearProgress variant="determinate" value={item.percentage} />
                  </Box>
                  <Box minWidth={35}>
                    <Typography variant="body2" color="textSecondary">{`${item.percentage.toFixed(2)}%`}</Typography>
                  </Box>
                </Box>
              ),
            },
            amount: {
              rawValue: item.amount,
              content: <Typography>{item.amount}</Typography>,
            },
          },
        }
      })

  return (
    <Paper sx={{ padding: 4, maxHeight: '56vh', overflow: 'auto' }}>
      {error ? <Typography>An error occurred during loading tokens...</Typography> : null}

      <div className={css.container}>
        <EnhancedTable
          rows={rows}
          headCells={headCells}
          onDemandPagination={{
            pageSize: pageSize,
            page: page,
            setPage: setPage,
            setPageSize: setPageSize,
            totalHolders: totalHolders,
          }}
        />
      </div>
    </Paper>
  )
}

export default HoldersTable
