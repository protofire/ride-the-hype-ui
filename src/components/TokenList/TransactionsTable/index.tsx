import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import css from './styles.module.css'
import type { EnhancedTableProps } from '~/components/common/EnhancedTable'
import type { Transaction } from '~/services/indexer-api/types'
import { useState } from 'react'
import useAsync from '~/hooks/useAsync'
import EthHashInfo from '~/components/common/EthHashInfo'
import InfiniteScrollTable from '~/components/common/EnhancedTable/InfiniteScrollTable'
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
const PAGE_SIZE = 5

const skeletonCells: EnhancedTableProps['rows'][0]['cells'] = {
  id: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" height="60px" />
      </Typography>
    ),
  },
  type: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" height="60px" />
      </Typography>
    ),
  },
  txHash: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" height="60px" />
      </Typography>
    ),
  },
  from: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" height="60px" />
      </Typography>
    ),
  },
  to: {
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
  dateTime: {
    rawValue: '',
    content: (
      <Typography>
        <Skeleton width="90px" height="60px" />
      </Typography>
    ),
  },
}
const skeletonRows: EnhancedTableProps['rows'] = Array(PAGE_SIZE).fill({ cells: skeletonCells })

const headCells = [
  {
    id: 'id',
    label: 'Id',
  },
  {
    id: 'type',
    label: 'Type',
  },
  {
    id: 'txHash',
    label: 'Tx Hash',
  },
  {
    id: 'from',
    label: 'From',
  },
  {
    id: 'to',
    label: 'To',
  },
  {
    id: 'amount',
    label: 'Amount',
  },
  {
    id: 'dateTime',
    label: 'Date Time',
  },
]

interface Props {
  fetchTransactions: (ticker: string, page: number, limit: number) => Promise<Transaction[]> | undefined
  totalTransactions: number
  ticker: string
}

const TransactionsTable = ({ fetchTransactions, ticker, totalTransactions }: Props) => {
  const [transactions, setTransactions] = useState([] as Transaction[])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const [newTransactions, error, loading] = useAsync(async () => {
    if (!!fetchTransactions) {
      try {
        const data = await fetchTransactions(ticker, page, PAGE_SIZE)
        setTransactions((prev) => prev.concat(data as Transaction[]))
        setHasMore(!(data && data.length < PAGE_SIZE))
        return data
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchTransactions, page, ticker])

  // useEffect(() => {
  //   if (newTransactions && newTransactions.length > 0) {
  //     setTransactions((prev) => prev.concat(newTransactions))
  //   }
  // }, [newTransactions])

  const rows = (transactions || []).map((item) => {
    const toValue = item.type === 'transfer' ? item.data.to[0].recv : item.to[0]
    const amountValue = item.type === 'transfer' ? item.data.to[0].amt : item.data.amt ?? null
    return {
      key: item.id.toString(),
      cells: {
        id: {
          rawValue: item.id,
          content: <Typography fontFamily={'Inter'}>{item.id}</Typography>,
        },
        type: {
          rawValue: item.type,
          content: <Typography fontFamily={'Inter'}>{item.type}</Typography>,
        },
        txHash: {
          rawValue: item.hash,
          content: (
            <Typography fontFamily={'Inter'}>
              <EthHashInfo showCopyButton address={item.hash} showPrefix={false} hasExplorer avatarSize={0} />
            </Typography>
          ),
        },
        from: {
          rawValue: item.from,
          content: (
            <Typography fontFamily={'Inter'}>
              <EthHashInfo showCopyButton address={item.from} showPrefix={false} hasExplorer avatarSize={0} />
            </Typography>
          ),
        },
        to: {
          rawValue: toValue,
          content: (
            <Typography fontFamily={'Inter'}>
              <EthHashInfo showCopyButton address={toValue} showPrefix={false} hasExplorer avatarSize={0} />
            </Typography>
          ),
        },
        amount: {
          rawValue: amountValue,
          content: <Typography fontFamily={'Inter'}>{amountValue}</Typography>,
        },
        dateTime: {
          rawValue: item.createdAt,
          content: (
            <Typography fontFamily={'Inter'}>{new Date(Number(item.createdAt) * 1000).toLocaleString()}</Typography>
          ),
        },
      },
    }
  })
  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      {error ? <Typography>An error occurred during loading tokens...</Typography> : null}

      <div className={css.container}>
        <InfiniteScrollTable
          rows={rows}
          headCells={headCells}
          infiniteScrollProps={{
            pageSize: PAGE_SIZE,
            page: page,
            hasMore: hasMore,
            setPage: setPage,
            totalTransactions: totalTransactions,
          }}
        />
      </div>
    </Paper>
  )
}

export default TransactionsTable
