import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import css from './../styles.module.css'
import { useState } from 'react'
import useAsync from '~/hooks/useAsync'
import type { EnhancedTableProps } from '~/components/common/EnhancedTable'
import EnhancedTable from '~/components/common/EnhancedTable'
import type { MarketplaceOrderExtended, MarketplaceOrderList } from '~/services/indexer-api/modules/marketplace/types'
import EthHashInfo from '~/components/common/EthHashInfo'
import { OrderStatus, type OrderParams } from '~/services/indexer-api/types'
import { fromWei } from 'web3-utils'
import Link from 'next/link'
import { Box, Button, CircularProgress, Skeleton, Snackbar, useTheme } from '@mui/material'
import { useCurrentChain } from '~/hooks/useChains'
import useOnboard from '~/hooks/wallets/useOnboard'
import { getAssertedChainSigner } from '~/utils/wallets'
import { createSiweMessage } from '~/utils/signing'
import { IndexerApiService } from '~/services/indexer-api'
import { defaultAbiCoder } from 'ethers/lib/utils'
import { ORDER_TYPE, CANCEL_ORDER_ID } from '~/utils/web3Types'

const headCells = [
  // {
  //   id: 'id',
  //   label: 'Id',
  // },
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
    id: 'seller',
    label: 'Seller',
  },
  {
    id: 'transaction',
    label: 'Transaction',
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

const skeletonCells: EnhancedTableProps['rows'][0]['cells'] = headCells.reduce(
  (cells, key) => ({ ...cells, [key.id]: { rawValue: key, content: <Skeleton /> } }),
  {},
)

const skeletonRows: EnhancedTableProps['rows'] = Array(5).fill({ cells: skeletonCells })

interface Props {
  tick: string
  fetchMarketplaceOrdersData: (params: OrderParams) => Promise<MarketplaceOrderList>
  seller?: string
}

type ButtonAction = {
  [key: number]: boolean
}

const ActivityTable = ({ tick, fetchMarketplaceOrdersData, seller }: Props) => {
  const currentChain = useCurrentChain()
  const onboard = useOnboard()
  const theme = useTheme()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(15)
  const [loadingStatus, setloadingStatus] = useState<ButtonAction>({})
  const [refetch, setRefetch] = useState(false)
  const [snackMessage, setSnackMessage] = useState<string | undefined>()

  const tableCells = !seller ? headCells : [...headCells, actionCell]

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackMessage(undefined)
  }

  const handleCancel = async (item: MarketplaceOrderExtended, index: number) => {
    if (!onboard || !currentChain) {
      console.log('Please check you wallet')
      return
    }

    try {
      setloadingStatus({ [index]: true })
      const signer = await getAssertedChainSigner(onboard, currentChain?.chainId)
      const address = await signer.getAddress()
      const indexerApiService = IndexerApiService.getInstance(currentChain)

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
      }

      const nonce = await indexerApiService.tokensModule.getAddressNonce(address)
      const message = createSiweMessage(
        address,
        `Agree to cancel order ${item.listId}`,
        currentChain.chainId,
        nonce.nonce,
      )

      const signature = await signer.signMessage(message)

      const { r, s, v } = await indexerApiService.tokensModule.signCancelOrder(inputData, message, signature)

      const cancelOrder = {
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
        v: v,
        r: r,
        s: s,
      }
      const input = defaultAbiCoder.encode([ORDER_TYPE], [Object.values(cancelOrder)])

      const data = CANCEL_ORDER_ID + input.substring(2)

      console.log({ data })

      const tx = {
        to: currentChain.marketplace,
        value: 0,
        data: data,
      }

      const transaction = await signer.sendTransaction(tx)
      await transaction.wait()

      console.log(transaction.hash)
      setSnackMessage(`Cancellation of ${item.ticker.toUpperCase()} order was successful.`)
      setRefetch(true)
    } catch (e) {
      console.error(e)
      setSnackMessage(`Cancellation was unsuccessful.`)
    }
    setloadingStatus({ [index]: false })
  }

  const [marketplaceData, error, loading] = useAsync(async () => {
    if (!!fetchMarketplaceOrdersData) {
      try {
        const data = await fetchMarketplaceOrdersData({ tick, page: page + 1, limit: pageSize, seller })
        setRefetch(false)
        return data
      } catch (e) {
        console.log(e)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchMarketplaceOrdersData, page, pageSize, seller, tick, refetch])

  const rows = (marketplaceData?.list || []).map((item, i) => {
    return {
      key: i.toString(),
      cells: {
        // id: {
        //   rawValue: item.id,
        //   content: item.id,
        // },
        status: {
          rawValue: item.status,
          content: (
            <>
              <Typography
                color={
                  item.status === OrderStatus.EXECUTED
                    ? theme.palette.warning.main
                    : item.status === OrderStatus.PENDING
                    ? theme.palette.secondary.main
                    : item.status === OrderStatus.LISTED
                    ? theme.palette.success.main
                    : item.status === OrderStatus.CANCELLED
                    ? theme.palette.primary.main
                    : theme.palette.text.primary
                }
              >
                {item.status === OrderStatus.EXECUTED ? 'Sold' : item.status}
              </Typography>
              {/* <EthHashInfo showPrefix={false} address={item.listId} hasExplorer avatarSize={0} /> */}
            </>
          ),
        },
        tick: {
          rawValue: tick,
          content: (
            <Link href={`/token?ticker=${tick}`}>
              <Typography color="primary">{tick}</Typography>
            </Link>
          ),
        },
        price: {
          rawValue: item.price,
          content: <Typography>{`ETH ${item.price}`}</Typography>,
        },
        amount: {
          rawValue: item.amount,
          content: <Typography>{+item.amount}</Typography>,
        },
        total: {
          rawValue: +item.amount * +item.price,
          content: <Typography>{`ETH ${+item.amount * +item.price}`}</Typography>,
        },
        seller: {
          rawValue: item.seller,
          content: <EthHashInfo showPrefix={false} address={item.seller} hasExplorer avatarSize={0} />,
        },
        transaction: {
          rawValue: item.lastTx,
          content: <EthHashInfo showPrefix={false} address={item.lastTx} hasExplorer avatarSize={0} />,
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
                <Box sx={{ textAlign: 'center' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {seller && item.status === OrderStatus.LISTED ? (
                    <Button variant="outlined" size="small" onClick={() => handleCancel(item, i)}>
                      Cancel
                    </Button>
                  ) : seller && item.status === OrderStatus.PENDING ? (
                    <Button variant="outlined" color="secondary" size="small" onClick={() => handleCancel(item, i)}>
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
    <>
      <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
        {error ? <Typography>An error occurred while loading marketplace activity data...</Typography> : null}
        <div className={css.container}>
          <EnhancedTable
            rows={loading || refetch ? skeletonRows : rows}
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
      {snackMessage && (
        <Snackbar open={!!snackMessage} autoHideDuration={5000} onClose={handleClose} message={snackMessage} />
      )}
    </>
  )
}

export default ActivityTable
