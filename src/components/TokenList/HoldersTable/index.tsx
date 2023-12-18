import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import css from './styles.module.css'
import type { EnhancedTableProps } from '~/components/common/EnhancedTable'
import EnhancedTable from '~/components/common/EnhancedTable'
import type { TokenHolder } from '~/services/indexer-api/types'
import type { SetStateAction } from 'react'
import { useState } from 'react'
import useAsync from '~/hooks/useAsync'
import EthHashInfo from '~/components/common/EthHashInfo'

const INITIAL_PAGE_SIZE = 10

const skeletonCells: EnhancedTableProps['rows'][0]['cells'] = {
  address: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" height="60px" />
      </Typography>
    ),
  },
  amount: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" height="60px" />
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
    id: 'amount',
    label: 'Amount',
  },
]

export interface onDemandFetchOption {
  pageSize: number
  page: number
  setPage: (value: SetStateAction<number>) => void
  setPageSize: (value: SetStateAction<number>) => void
  totalHolders: number
}

interface Props {
  fetchHolders: (ticker: string, page: number, limit: number) => Promise<TokenHolder[]> | undefined
  ticker: string
  totalHolders: number
}

const HoldersTable = ({ fetchHolders, ticker, totalHolders }: Props) => {
  // const [holders, setHolders] = useState([] as TokenHolder[])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE)

  const [holders, error, loading] = useAsync(async () => {
    if (!!fetchHolders && totalHolders > 0) {
      try {
        const data = await fetchHolders(ticker, page + 1, pageSize) //in API page starts from 1, while in front-end - from 0
        return data
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchHolders, page, pageSize, ticker, totalHolders])

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
                <Typography fontFamily={'Inter'}>
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
            amount: {
              rawValue: item.amount,
              content: <Typography fontFamily={'Inter'}>{item.amount}</Typography>,
            },
          },
        }
      })

  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
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
