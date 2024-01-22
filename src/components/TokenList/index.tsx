import { useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { Box, Button, Skeleton, Typography } from '@mui/material'

import { TokenListItem } from '~/components/TokenList/TokenListItem'
import useBalances from '~/hooks/useBalances'

import css from './styles.module.css'
import useWallet from '~/hooks/wallets/useWallet'
import ConnectWallet from '../common/ConnectWallet'
import { getAssertedChainSigner } from '~/utils/wallets'
import { useCurrentChain } from '~/hooks/useChains'
import { marketplaceDomainEIP712, marketplaceTypesEIP712 } from '~/utils/signing'
import useOnboard from '~/hooks/wallets/useOnboard'
import { IndexerApiService } from '~/services/indexer-api'
import type { MarketplaceOrder, MarketplaceOrderPayload } from '~/services/indexer-api/modules/marketplace/types'
import { ZERO_ADDRESS } from '~/config/constants'
import { toHex } from 'web3-utils'
import type { TransactionResponse } from '@ethersproject/abstract-provider'

const PAGE_SIZE = 12

export const TokenList = () => {
  const onboard = useOnboard()
  const { balances, loading, error } = useBalances()
  const [page, setPage] = useState(1)
  const wallet = useWallet()
  const [tx, setTx] = useState<TransactionResponse | undefined>()

  const visibleBalances = useMemo(() => balances.insc20s.slice(0, PAGE_SIZE * page), [balances.insc20s, page])
  const hasMore = visibleBalances.length % PAGE_SIZE === 0
  const currentChain = useCurrentChain()
  const chainId = currentChain?.chainId

  const domain = marketplaceDomainEIP712(chainId ?? '1337')

  if (!wallet || !wallet.address)
    return (
      <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto', textAlign: 'center' }}>
        <Typography>Please connect your wallet to see your tokens</Typography>
        <Box display="flex" justifyContent="center" sx={{ pt: '10px' }}>
          <ConnectWallet />
        </Box>
      </Paper>
    )

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

      {error ? <Typography>An error occurred during loading balances...</Typography> : null}

      {!loading && balances.insc20s.length === 0 ? (
        <>
          <Button
            onClick={async () => {
              if (!onboard || !currentChain) {
                console.log('Please check you wallet')
                return
              }
              // console.log(data)
              const signer = await getAssertedChainSigner(onboard, currentChain?.chainId)
              const address = await signer.getAddress()
              const listingDateUnix = Math.floor(Date.now() / 1000)

              const mockMessage: MarketplaceOrder = {
                seller: address,
                creator: currentChain.marketplace ?? ZERO_ADDRESS,
                listId: '0x6e00d7d8de50be189729a519a9332bfa77d82fc3ad1de0570394e985444cd72e',
                ticker: 'test1',
                amount: '0x5f5e100',
                price: '0x916f7200',
                listingTime: listingDateUnix,
                expirationTime: listingDateUnix + 86400,
                creatorFeeRate: 200,
                salt: 1234567897,
              }

              //Sign the data
              const signature = await signer._signTypedData(domain, marketplaceTypesEIP712, mockMessage)

              const indexerApiService = IndexerApiService.getInstance(currentChain)
              const r = signature.slice(0, 66)
              const s = '0x' + signature.slice(66, 130)
              const v = '0x' + signature.slice(130, 132)

              //DATA to pass to EVM
              const txData = {
                p: `${currentChain.inscriptionPrefix}-20`,
                op: 'list',
                tick: mockMessage.ticker,
                amt: mockMessage.amount,
              }

              const dataHex = toHex('data:,' + JSON.stringify(txData))

              const tx = await signer.sendTransaction({
                to: currentChain?.marketplace,
                value: 0,
                data: dataHex,
              })

              setTx(tx)
              await tx.wait()

              // Create order in API
              const createMockOrder: MarketplaceOrderPayload = {
                order: mockMessage,
                v: +v,
                r: r,
                s: s,
              }

              const createOrderResult = await indexerApiService.tokensModule.createOrder(createMockOrder)
              console.log({ signature, createMockOrder, createOrderResult })
            }}
          >
            TEST SIGNING COMPARISON WITH API
          </Button>
          <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto', textAlign: 'center' }}>
            <Typography>You don&apos;t have any OSC-20 yet</Typography>
          </Paper>
        </>
      ) : null}

      <InfiniteScroll
        dataLength={visibleBalances.length}
        next={() => setPage((page) => page + 1)}
        hasMore={hasMore}
        loader={''}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>You have seen it all</b>
          </p>
        }
      >
        <div className={css.gridContainer}>
          {visibleBalances.map((item) => (
            <TokenListItem key={item.tokenId} item={item} />
          ))}
        </div>
      </InfiniteScroll>
      <div />
    </Paper>
  )
}
