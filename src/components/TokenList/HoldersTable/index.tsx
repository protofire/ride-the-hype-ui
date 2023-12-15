import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import css from './styles.module.css'
import type { EnhancedTableProps } from '~/components/common/EnhancedTable'
import EnhancedTable from '~/components/common/EnhancedTable'
import type { TokenHolder } from '~/services/indexer-api/types'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import useAsync from '~/hooks/useAsync'

const PAGE_SIZE = 10

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
const skeletonRows: EnhancedTableProps['rows'] = Array(25).fill({ cells: skeletonCells })

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

interface Props {
  fetchHolders: (ticker: string, page: number, limit: number) => Promise<TokenHolder[]> | undefined
  ticker: string
}

const HoldersTable = ({ fetchHolders, ticker }: Props) => {
  const router = useRouter()

  const [holders, setHolders] = useState([] as TokenHolder[])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  const [newTokens, error, loading] = useAsync(async () => {
    if (!!fetchHolders) {
      try {
        const data = await fetchHolders(ticker, page, PAGE_SIZE)

        setHasMore(!(data && data.length < PAGE_SIZE))

        return data
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchHolders, page, ticker])

  // Add new tokens to the accumulated list
  useEffect(() => {
    if (newTokens && newTokens.length > 0) {
      setHolders((prev) => prev.concat(newTokens))
    }
  }, [newTokens])

  const rows = loading
    ? skeletonRows
    : (holders || []).map((item) => {
        return {
          key: item.address,
          cells: {
            address: {
              rawValue: item.address,
              content: item.address,
            },
            amount: {
              rawValue: item.amount,
              content: <Typography>{item.amount}</Typography>,
            },
          },
        }
      })

  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      {error ? <Typography>An error occurred during loading tokens...</Typography> : null}

      <div className={css.container}>
        <EnhancedTable rows={rows} headCells={headCells} />
      </div>
    </Paper>
  )
}

export default HoldersTable
