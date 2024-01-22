import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'
import { toHex, toWei } from 'web3-utils'

import ModalDialog from '~/components/common/ModalDialog'
import type { Insc20, Insc20Balance } from '~/services/indexer-api/types'
import { useCurrentChain } from '~/hooks/useChains'

import css from './styles.module.css'
import useOnboard from '~/hooks/wallets/useOnboard'
import { useState } from 'react'
import { Box, CircularProgress, ListItem, ListItemText, MenuItem, Select, Typography } from '@mui/material'
import { TokenDataCard } from '~/components/TokenList/TokenDataCard'
import { marketplaceDomainEIP712, marketplaceTypesEIP712 } from '~/utils/signing'
import { getAssertedChainSigner } from '~/utils/wallets'
import type { MarketplaceOrder, MarketplaceOrderPayload } from '~/services/indexer-api/modules/marketplace/types'
import type { TransactionResponse } from '@ethersproject/abstract-provider'
import { ZERO_ADDRESS } from '~/config/constants'
import { IndexerApiService } from '~/services/indexer-api'

interface Props {
  open: boolean
  onClose: () => void
  tick: Insc20['tick']
  tokenData: Insc20Balance
}

type ListInsc20FormData = {
  amount: number
  price: number
  expiration: number
}

const MOCK_SALT = 772957950
const MOCK_LISTING_ID = '0x6e00d7d8de50be189729a519a9332bfa77d82fc3ad1de0570394e985444cd72e'

const ListInsc20Modal = ({ open, onClose, tick, tokenData }: Props) => {
  const currentChain = useCurrentChain()
  const onboard = useOnboard()
  const [loading, setLoading] = useState<boolean>(false)
  const chainId = currentChain?.chainId
  const [tx, setTx] = useState<TransactionResponse | undefined>()

  const domain = marketplaceDomainEIP712(chainId ?? '1337', currentChain?.marketplace)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    getValues,
    watch,
  } = useForm<ListInsc20FormData>()

  const onSubmit: SubmitHandler<ListInsc20FormData> = async (data, __) => {
    setLoading(true)
    if (!onboard || !currentChain) {
      console.log('Please check you wallet')
      return
    }

    try {
      const signer = await getAssertedChainSigner(onboard, currentChain?.chainId)
      const address = await signer.getAddress()
      const listingDateUnix = Math.floor(Date.now() / 1000)

      const txData = {
        p: `${currentChain.inscriptionPrefix}-20`,
        op: 'list',
        tick: tick,
        amt: data.amount.toString(),
      }

      const dataHex = toHex('data:,' + JSON.stringify(txData))

      const tx = await signer.sendTransaction({
        to: currentChain?.marketplace,
        value: 0,
        data: dataHex,
      })

      setTx(tx)
      await tx.wait()

      console.log({ tx })

      const order: MarketplaceOrder = {
        seller: address,
        creator: currentChain?.marketplace || ZERO_ADDRESS,
        listId: tx.hash,
        ticker: tick,
        amount: data.amount.toString(),
        price: toWei(data.price.toString(), 'ether'),
        listingTime: listingDateUnix,
        expirationTime: +listingDateUnix + +data.expiration,
        creatorFeeRate: 200,
        salt: MOCK_SALT,
      }
      const signature = await signer._signTypedData(domain, marketplaceTypesEIP712, order)

      const r = signature.slice(0, 66)
      const s = '0x' + signature.slice(66, 130)
      const v = '0x' + signature.slice(130, 132)

      const createOrder: MarketplaceOrderPayload = {
        order: order,
        v: +v,
        r: r,
        s: s,
      }

      console.log({ createOrder })

      const indexerApiService = IndexerApiService.getInstance(currentChain)
      const createOrderResult = await indexerApiService.tokensModule.createOrder(createOrder)

      console.log({ createOrderResult })
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  const amount = watch('amount')
  const price = watch('price')
  const SOLIDITY_MONTH = 2592000
  const SOLIDITY_YEAR = 31556952

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <ModalDialog open={open} onClose={handleClose} dialogTitle={`List ${tick}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className={css.transferModalContainer}>
          <div className={css.transferModalFields}>
            <TokenDataCard item={tokenData} />
            <TextField
              required
              label="Amount"
              defaultValue={tokenData.amount}
              error={errors?.amount?.message !== undefined}
              // helperText={errors?.amount?.type === 'validUrl' && errors?.appUrl?.message}
              autoComplete="off"
              type="number"
              {...register('amount', {
                required: true,
                valueAsNumber: true,
              })}
            />
            <TextField
              required
              label="Price"
              {...register('price', {
                required: true,
                valueAsNumber: true,
              })}
            />
            <ListItem>
              <ListItemText primary="Expiration" />
              <Select
                defaultValue={SOLIDITY_MONTH}
                label="Expiration"
                error={errors?.amount?.message !== undefined}
                autoComplete="off"
                {...register('expiration', {
                  required: true,
                })}
              >
                <MenuItem value={SOLIDITY_MONTH}>1 Month</MenuItem>
                <MenuItem value={SOLIDITY_YEAR}>1 Year</MenuItem>
              </Select>
            </ListItem>
            <ListItem>
              <ListItemText primary="Service Fee" />
              <Typography>2%</Typography>
            </ListItem>
            <ListItem>
              <ListItemText primary="Total revenue" />
              <Typography>{`${amount * price} ETH`}</Typography>
            </ListItem>
          </div>
        </DialogContent>

        <DialogActions disableSpacing>
          {loading ? (
            <Box width="100%" display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={!isValid}>
                List
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </ModalDialog>
  )
}

export default ListInsc20Modal
