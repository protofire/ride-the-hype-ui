import Button from '@mui/material/Button'
import CheckWallet from '~/components/common/CheckWallet'
import css from './styles.module.css'
import { IconButton, ListItem, ListItemText, Stack } from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import type { MarketplaceOrderExtended } from '~/services/indexer-api/modules/marketplace/types'
import { fromWei } from 'web3-utils'
import EthHashInfo from '../common/EthHashInfo'
import Link from 'next/link'
import { useCurrentChain } from '~/hooks/useChains'
import useOnboard from '~/hooks/wallets/useOnboard'
import { getAssertedChainSigner } from '~/utils/wallets'
import { defaultAbiCoder } from 'ethers/lib/utils'

interface Props {
  item: MarketplaceOrderExtended
}

const EXECUTE_ORDER_TYPE = [
  //Order
  `tuple(address,
    address,
    bytes32, 
    string, 
    uint256, 
    uint256,
    uint64, 
    uint64, 
    uint16, 
    uint32, 
    uint8, 
    bytes32, 
    bytes32)`,
  //Recipient
  'address',
]

export const MarketplaceTokenListItem = ({ item }: Props) => {
  const tempUSDPrice = '$ _'
  const currentChain = useCurrentChain()
  const onboard = useOnboard()

  const handleBuy = async (item: MarketplaceOrderExtended) => {
    if (!onboard || !currentChain) {
      console.log('Please check you wallet')
      return
    }

    try {
      const signer = await getAssertedChainSigner(onboard, currentChain?.chainId)
      const address = await signer.getAddress()
      console.log({ item })

      const inputData = {
        seller: item.seller,
        address: item.creator,
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
      const input = defaultAbiCoder.encode(EXECUTE_ORDER_TYPE, [Object.values(inputData), address])
      const methodId = '0xd9b3d6d0'
      const data = methodId + input.substring(2)

      console.log({ data })

      const tx = {
        to: currentChain.marketplace,
        value: item.price,
        data: data,
      }

      const transaction = await signer.sendTransaction(tx)

      console.log(transaction.hash)
    } catch (e) {
      console.error(e)
    }
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
          <ListItemText primary={tempUSDPrice} />
          {`ETH ${fromWei(item.price)}`}
        </ListItem>
        <div className={css.cardFooter}>
          <div className={css.hash}>
            {' '}
            <EthHashInfo address={item.listId} hasExplorer avatarSize={0} />
          </div>
          <div className={css.actions}>
            <CheckWallet>
              {(isOk) => (
                <Stack direction={'row'} spacing={2}>
                  <Button onClick={() => handleBuy(item)} variant="contained">
                    Buy
                  </Button>
                  <IconButton color="primary">
                    <AddShoppingCartIcon />
                  </IconButton>
                </Stack>
              )}
            </CheckWallet>
          </div>
        </div>
      </div>
    </>
  )
}
