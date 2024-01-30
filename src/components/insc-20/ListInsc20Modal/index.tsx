import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'
import { toHex, toWei } from 'web3-utils'

import ModalDialog from '~/components/common/ModalDialog'
import { type Insc20, type Insc20Balance } from '~/services/indexer-api/types'
import { useCurrentChain } from '~/hooks/useChains'

import css from './styles.module.css'
import useOnboard from '~/hooks/wallets/useOnboard'
import { useState } from 'react'
import {
  Box,
  CircularProgress,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material'
import { TokenDataCard } from '~/components/TokenList/TokenDataCard'
import { marketplaceDomainEIP712, marketplaceTypesEIP712 } from '~/utils/signing'
import { getAssertedChainSigner } from '~/utils/wallets'
import type { MarketplaceOrder, MarketplaceOrderPayload } from '~/services/indexer-api/modules/marketplace/types'
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

enum ListingStatus {
  IDLE,
  SENDING_TX,
  SIGNING_TX,
  INDEXING,
  COMPLETED,
  REJECTED,
  ERROR,
}

const isLoading = (status: ListingStatus) => {
  return status == ListingStatus.SENDING_TX || status == ListingStatus.SIGNING_TX || status === ListingStatus.INDEXING
}

const steps = ['Send a list inscription', 'Sign an order', 'Index']

const MOCK_SALT = 772957950

const ListInsc20Modal = ({ open, onClose, tick, tokenData }: Props) => {
  const currentChain = useCurrentChain()
  const onboard = useOnboard()
  const chainId = currentChain?.chainId
  // const [tx, setTx] = useState<TransactionResponse | undefined>()
  const [status, setStatus] = useState<ListingStatus>(ListingStatus.IDLE)
  const [activeStep, setActiveStep] = useState(0)
  const [snackMessage, setSnackMessage] = useState<string | undefined>()

  console.log(status)

  const domain = marketplaceDomainEIP712(chainId ?? '1337', currentChain?.marketplace)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<ListInsc20FormData>()
  const onSubmit: SubmitHandler<ListInsc20FormData> = async (data, __) => {
    // setLoading(true)
    if (!onboard || !currentChain) {
      console.log('Please check you wallet')
      return
    }

    try {
      setStatus(ListingStatus.SENDING_TX)
      const signer = await getAssertedChainSigner(onboard, currentChain?.chainId)
      const address = await signer.getAddress()
      const indexerApiService = IndexerApiService.getInstance(currentChain)

      const listingDateUnix = await indexerApiService.tokensModule.getTimestamp()

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

      await tx.wait()

      console.log({ tx })

      setStatus(ListingStatus.SIGNING_TX)
      setActiveStep(1)
      const order: MarketplaceOrder = {
        seller: address,
        creator: currentChain?.marketplace || ZERO_ADDRESS,
        listId: tx.hash,
        ticker: tick,
        amount: data.amount.toString(),
        price: toWei(data.price.toString(), 'ether'),
        listingTime: +listingDateUnix.timestamp,
        expirationTime: +listingDateUnix.timestamp + +data.expiration,
        creatorFeeRate: 200,
        salt: MOCK_SALT,
      }
      const signature = await signer._signTypedData(domain, marketplaceTypesEIP712, order)

      const r = signature.slice(0, 66)
      const s = '0x' + signature.slice(66, 130)
      const v = '0x' + signature.slice(130, 132)

      setStatus(ListingStatus.INDEXING)
      setActiveStep(2)
      const createOrder: MarketplaceOrderPayload = {
        order: order,
        v: +v,
        r: r,
        s: s,
      }

      console.log({ createOrder })
      const createOrderResult = await indexerApiService.tokensModule.createOrder(createOrder)

      console.log({ createOrderResult })
      setStatus(ListingStatus.COMPLETED)
      setActiveStep(0)
      setSnackMessage('Listing was successful!')
      reset()
      handleClose()
    } catch (e: any) {
      setStatus(ListingStatus.ERROR)
      setSnackMessage('Something went wrong.')
      console.error(e)
    }
    // setLoading(false)
  }

  const amount = watch('amount')
  const price = watch('price')
  const SOLIDITY_MONTH = 2592000
  const SOLIDITY_YEAR = 31556952

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleCloseSnack = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackMessage(undefined)
  }

  return (
    <>
      <ModalDialog
        open={open}
        onClose={handleClose}
        dialogTitle={
          <>
            {`List ${tick}`} {isLoading(status) && <CircularProgress sx={{ ml: 2 }} />}
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent className={css.transferModalContainer}>
            <div className={css.transferModalFields}>
              <TokenDataCard item={tokenData} />
              <TextField
                required
                label="Amount"
                defaultValue={1}
                error={errors?.amount?.message !== undefined}
                autoComplete="off"
                type="number"
                inputProps={{
                  min: 1,
                  max: tokenData.amount,
                }}
                {...register('amount', {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              <TextField
                required
                label="Price"
                defaultValue={1}
                inputProps={{
                  step: 0.000000000000000001,
                  min: 0,
                  type: 'number',
                }}
                {...register('price', {
                  required: true,
                  valueAsNumber: true,
                })}
              />
              <ListItem>
                <ListItemText primary="Expiration" />
                <Select
                  size="small"
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
                <Typography>{`${parseFloat((amount * price).toFixed(6).toString())} ETH`}</Typography>
              </ListItem>
            </div>
          </DialogContent>

          <DialogActions disableSpacing>
            {isLoading(status) ? (
              <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
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

      <Snackbar open={!!snackMessage} autoHideDuration={5000} onClose={handleCloseSnack} message={snackMessage} />
    </>
  )
}

export default ListInsc20Modal
