import Button from '@mui/material/Button'
import CheckWallet from '~/components/common/CheckWallet'
import css from './styles.module.css'
import { CircularProgress, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import type { MarketplaceOrderExtended } from '~/services/indexer-api/modules/marketplace/types'
import { fromWei } from 'web3-utils'
import EthHashInfo from '../common/EthHashInfo'
import Link from 'next/link'
import { useCurrentChain } from '~/hooks/useChains'
import useOnboard from '~/hooks/wallets/useOnboard'
import { getAssertedChainSigner } from '~/utils/wallets'
import { defaultAbiCoder } from 'ethers/lib/utils'
import { useState } from 'react'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import { ORDER_TYPE, RECIPIENT_TYPE } from '~/utils/web3Types'

interface Props {
  item: MarketplaceOrderExtended
}

export const MarketplaceTokenListItem = ({ item }: Props) => {
  const currentChain = useCurrentChain()
  const onboard = useOnboard()
  const [loading, setloading] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const totalPrice = +item.price * +item.amount

  const handleBuy = async (item: MarketplaceOrderExtended) => {
    if (!onboard || !currentChain) {
      console.log('Please check you wallet')
      return
    }

    try {
      setloading(true)
      setDisabled(true)
      const signer = await getAssertedChainSigner(onboard, currentChain?.chainId)
      const address = await signer.getAddress()
      console.log({ item })

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

      console.log(inputData)
      console.log(Object.values(inputData))
      const input = defaultAbiCoder.encode([ORDER_TYPE, RECIPIENT_TYPE], [Object.values(inputData), address])
      const methodId = '0xd207627f'
      const data = methodId + input.substring(2)

      console.log({ data })

      const tx = {
        to: currentChain.marketplace,
        value: totalPrice.toString(),
        data: data,
      }

      const transaction = await signer.sendTransaction(tx)
      await signer.provider.waitForTransaction(transaction.hash)

      // await delay(3000)
      // setRefetch(true)
      console.log(transaction.hash)
    } catch (e) {
      console.error(e)
      setDisabled(false)
    }
    setloading(false)
  }
  return (
    <>
      <div className={css.card}>
        <div className={css.cardHeader}>
          <Link href={`/token?ticker=${item.ticker}`}>
            <span className={css.dollar}>{item.ticker}</span>
          </Link>
        </div>
        <div className={css.cardBody}>{item.amount.toLocaleString()}</div>
        <ListItem>
          <ListItemText primary={`ETH ${fromWei(item.price)}`} />
          {`$ ${+item.amountUsd}`}
        </ListItem>
        {/* <Typography align="center">{`Total:  ETH ${fromWei(totalPrice.toString())}`}</Typography> */}
        <div className={css.cardFooter}>
          <div className={css.hash}>
            {' '}
            <EthHashInfo address={item.listId} hasExplorer avatarSize={0} />
          </div>
          <div className={css.actions}>
            <CheckWallet>
              {(isOk) => (
                <>
                  {loading ? (
                    <Stack width="100%" alignItems="center" justifyContent="center" direction="row" spacing={2}>
                      <CircularProgress />
                      <Typography variant="body2" color="primary">
                        {'Initiating...'}
                      </Typography>
                    </Stack>
                  ) : (
                    <Stack direction={'row'} spacing={2}>
                      <Button
                        disabled={disabled}
                        endIcon={<AddShoppingCartIcon />}
                        onClick={() => handleBuy(item)}
                        variant="contained"
                      >
                        {disabled ? 'BOUGHT' : `ETH ${fromWei(totalPrice.toString())}`}
                      </Button>
                      {/* <IconButton disabled color="primary">
                        <AddShoppingCartIcon />
                      </IconButton> */}
                    </Stack>
                  )}
                </>
              )}
            </CheckWallet>
          </div>
        </div>
      </div>
    </>
  )
}
