import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import css from './../styles.module.css'
import { useState } from 'react'
import useAsync from '~/hooks/useAsync'
import EnhancedTable from '~/components/common/EnhancedTable'
import type { MarketplaceOrderExtended, MarketplaceOrderList } from '~/services/indexer-api/modules/marketplace/types'
import { AppRoutes } from '~/config/routes'
import EthHashInfo from '~/components/common/EthHashInfo'
import { OrderStatus, type OrderParams } from '~/services/indexer-api/types'
import { fromWei } from 'web3-utils'
import Link from 'next/link'
import { Button, CircularProgress } from '@mui/material'
import { useCurrentChain } from '~/hooks/useChains'
import useOnboard from '~/hooks/wallets/useOnboard'
import { defaultAbiCoder } from 'ethers/lib/utils'
import { getAssertedChainSigner } from '~/utils/wallets'
import { CANCEL_ORDER_ID, ORDER_TYPE } from '~/utils/web3Types'
import useWallet from '~/hooks/wallets/useWallet'

const headCells = [
  {
    id: 'status',
    label: 'Status',
  },
  {
    id: 'tick',
    label: 'Ticker',
  },
  {
    id: 'price',
    label: 'Price',
  },
  {
    id: 'amount',
    label: 'Amount',
  },
  {
    id: 'total',
    label: 'Total',
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
    id: 'time',
    label: 'Time',
  },
]

const actionCell = {
  id: 'action',
  label: 'Action',
}

interface Props {
  tick: string
  fetchMarketplaceOrdersData: (params: OrderParams) => Promise<MarketplaceOrderList>
  seller?: string
}

type ButtonAction = {
  [key: number]: boolean
}

const ActivityTable = ({ tick, fetchMarketplaceOrdersData, seller }: Props) => {
  // const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(15)
  const [showAll, setShowAll] = useState(false)
  const currentChain = useCurrentChain()
  const onboard = useOnboard()
  const [loadingStatus, setloadingStatus] = useState<ButtonAction>({})

  const wallet = useWallet()

  const tableCells = !seller ? headCells : [...headCells, actionCell]

  const handleCancel = async (item: MarketplaceOrderExtended, index: number) => {
    if (!onboard || !currentChain) {
      console.log('Please check you wallet')
      return
    }

    try {
      setloadingStatus({ [index]: true })
      const signer = await getAssertedChainSigner(onboard, currentChain?.chainId)
      const address = await signer.getAddress()
      const inputData = {
        seller: item.seller,
        creator: item.creator,
        listId: item.listId,
        ticker: item.ticker,
        amount: item.amount,
        price: item.price,
        listingTime: item.listingTime,
        expirationTime: item.expirationTime,
        creatorFeeRate: item.creatorFeeRate,
        salt: item.salt,
        v: item.v,
        r: item.r,
        s: item.s,
      }
      const input = defaultAbiCoder.encode([ORDER_TYPE], [Object.values(inputData)])

      const data = CANCEL_ORDER_ID + input.substring(2)

      console.log({ data })

      const tx = {
        to: currentChain.marketplace,
        value: 0,
        data: data,
      }

      const transaction = await signer.sendTransaction(tx)
      const receipt = await signer.provider.waitForTransaction(transaction.hash)

      console.log(transaction.hash)
    } catch (e) {
      console.error(e)
    }
    setloadingStatus({ [index]: false })
  }

  const [marketplaceData, error, loading] = useAsync(async () => {
    if (!!fetchMarketplaceOrdersData) {
      try {
        const data = await fetchMarketplaceOrdersData({ tick, page: page + 1, limit: pageSize, seller })
        return data
      } catch (e) {
        console.log(e)
      }
    }
  }, [fetchMarketplaceOrdersData, page, pageSize, seller, tick])

  const rows = (marketplaceData?.list || []).map((item, i) => {
    return {
      key: i.toString(),
      href: AppRoutes.marketplace.token + `?ticker=${tick}`,
      cells: {
        status: {
          rawValue: item.status,
          content: (
            <>
              <Typography>{item.status}</Typography>
              {/* <EthHashInfo showPrefix={false} address={item.listId} hasExplorer avatarSize={0} /> */}
            </>
          ),
        },
        tick: {
          rawValue: tick,
          content: (
            <Link href={`/tokens?ticker=${tick}`}>
              <Typography color="primary">{tick}</Typography>
            </Link>
          ),
        },
        price: {
          rawValue: item.price,
          content: <Typography>{`ETH ${fromWei(item.price)}`}</Typography>,
        },
        amount: {
          rawValue: item.amount,
          content: <Typography>{+item.amount}</Typography>,
        },
        total: {
          rawValue: +item.amount * +item.price,
          content: <Typography>{`ETH ${fromWei((+item.amount * +item.price).toString())}`}</Typography>,
        },
        from: {
          rawValue: item.seller,
          content: <EthHashInfo showPrefix={false} address={item.seller} hasExplorer avatarSize={0} />,
        },
        to: {
          rawValue: item.creator,
          content: <EthHashInfo showPrefix={false} address={item.creator} hasExplorer avatarSize={0} />,
        },
        time: {
          rawValue: item.listingTime,
          content: (
            <>
              {item.expirationTime && (
                <Typography>{new Date(Number(item.expirationTime) * 1000).toLocaleString()}</Typography>
              )}
            </>
          ),
        },
        action: {
          rawValue: i,
          content: (
            <>
              {loadingStatus[i] ? (
                <CircularProgress />
              ) : (
                <>
                  {seller && item.status === OrderStatus.LISTED ? (
                    <Button variant="outlined" size="small" onClick={() => handleCancel(item, i)}>
                      Cancel
                    </Button>
                  ) : seller && item.status === OrderStatus.PENDING ? (
                    <Button variant="outlined" color="secondary" size="small">
                      Refund
                    </Button>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </>
          ),
        },
      },
    }
  })
  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      {error ? <Typography>An error occurred while loading marketplace activity data...</Typography> : null}
      <div className={css.container}>
        <EnhancedTable
          rows={rows}
          headCells={tableCells}
          onDemandPagination={{
            pageSize: pageSize,
            page: page,
            setPage: setPage,
            setPageSize: setPageSize,
            totalHolders: marketplaceData?.count ?? 0,
          }}
        />
      </div>
    </Paper>
  )
}

export default ActivityTable
