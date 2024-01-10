import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'

import ModalDialog from '~/components/common/ModalDialog'
import type { Insc20, Insc20Balance } from '~/services/indexer-api/types'
import { useCurrentChain } from '~/hooks/useChains'

import css from './styles.module.css'
//import { ZERO_ADDRESS } from '~/config/constants'
import useOnboard from '~/hooks/wallets/useOnboard'
import { useState } from 'react'
import { Box, CircularProgress, ListItem, ListItemText, MenuItem, Select, Typography } from '@mui/material'
import { TokenDataCard } from '~/components/TokenList/TokenDataCard'

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

// TODO: implement batch transfer
const ListInsc20Modal = ({ open, onClose, tick, tokenData }: Props) => {
  const currentChain = useCurrentChain()
  const onboard = useOnboard()
  const [loading, setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    getValues,
    watch,
  } = useForm<ListInsc20FormData>({ defaultValues: { amount: 0 }, mode: 'onChange' })

  const onSubmit: SubmitHandler<ListInsc20FormData> = async (data, __) => {
    console.log(data)
    if (!onboard || !currentChain) {
      console.log('Please check you wallet')
      return
    }
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
              defaultValue={0}
              autoComplete="off"
              type="number"
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
