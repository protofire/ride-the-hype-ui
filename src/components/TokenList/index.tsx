import { useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { Box, Skeleton, Typography } from '@mui/material'

import { TokenListItem } from '~/components/TokenList/TokenListItem'
import useBalances from '~/hooks/useBalances'

import css from './styles.module.css'
import useWallet from '~/hooks/wallets/useWallet'
import ConnectWallet from '../common/ConnectWallet'
import { useCurrentChain } from '~/hooks/useChains'
import { marketplaceDomainEIP712 } from '~/utils/signing'
import useOnboard from '~/hooks/wallets/useOnboard'
import type { TransactionResponse } from '@ethersproject/abstract-provider'
import ContentPaper from '../common/ContentPaper'

const PAGE_SIZE = 3

export const TokenList = ({ title }: { title?: string }) => {
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
      <ContentPaper title={title}>
        <Typography sx={{ textAlign: 'center' }}>Please connect your wallet to see your tokens</Typography>
        <Box display="flex" justifyContent="center" sx={{ pt: '10px' }}>
          <ConnectWallet />
        </Box>
      </ContentPaper>
    )

  return (
    <ContentPaper title={title}>
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
          <Paper sx={{ textAlign: 'center' }}>
            <Typography>{`You don't have any ${currentChain?.inscriptionPrefix.toUpperCase()}-20 yet`}</Typography>
          </Paper>
        </>
      ) : null}

      <InfiniteScroll
        dataLength={visibleBalances.length}
        next={() => setPage((page) => page + 1)}
        hasMore={hasMore}
        loader={''}
        height={'56vh'}
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
    </ContentPaper>
  )
}
