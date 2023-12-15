import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import css from './styles.module.css'
import type { EnhancedTableProps } from '~/components/common/EnhancedTable'
import EnhancedTable from '~/components/common/EnhancedTable'
import type { TokenHolder } from '~/services/indexer-api/types'
import { useState, useEffect } from 'react'
import useAsync from '~/hooks/useAsync'
import EthHashInfo from '~/components/common/EthHashInfo'

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
  const [holders, setHolders] = useState([] as TokenHolder[])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)

  const [newHolders, error, loading] = useAsync(async () => {
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
    if (newHolders && newHolders.length > 0) {
      setHolders((prev) => prev.concat(newHolders))
    }
  }, [newHolders])

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
        <EnhancedTable rows={rows} headCells={headCells} />
      </div>
    </Paper>
  )
}

export default HoldersTable
