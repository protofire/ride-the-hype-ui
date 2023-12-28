import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { isAddress } from 'ethers/lib/utils'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'

import ModalDialog from '~/components/common/ModalDialog'
import type { Insc20, Insc20Balance } from '~/services/indexer-api/types'
import { useCurrentChain } from '~/hooks/useChains'

import css from './styles.module.css'
import { getAssertedChainSigner } from '~/utils/wallets'
import { toHex } from 'web3-utils'
//import { ZERO_ADDRESS } from '~/config/constants'
import useOnboard from '~/hooks/wallets/useOnboard'
import { useState } from 'react'
import { Box, CircularProgress } from '@mui/material'

interface Props {
  open: boolean
  onClose: () => void
  tick: Insc20['tick']
  maxAmount: Insc20Balance['amount']
}

type TransferInsc20FormData = {
  amount: number
  beneficiary: string
}

// TODO: implement batch transfer
const TransferInsc20Modal = ({ open, onClose, tick, maxAmount }: Props) => {
  const currentChain = useCurrentChain()
  const onboard = useOnboard()
  const [loading, setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<TransferInsc20FormData>({ defaultValues: { amount: 0 }, mode: 'onChange' })

  const onSubmit: SubmitHandler<TransferInsc20FormData> = async (data, __) => {
    if (!onboard || !currentChain) {
      console.log('Please check you wallet')
      return
    }

    try {
      setLoading(true)
      const signer = await getAssertedChainSigner(onboard, currentChain?.chainId)

      const txData = {
        p: `${currentChain.inscriptionPrefix}-20`,
        op: 'transfer',
        tick,
        to: [
          {
            recv: data.beneficiary,
            amt: data.amount,
          },
        ],
        //nonce: (+new Date()).toString(),
      }

      const dataHex = toHex('data:,' + JSON.stringify(txData))

      const tx = await signer.sendTransaction({
        to: signer.getAddress(),
        value: 0,
        data: dataHex,
      })

      await tx.wait()

      reset()
      onClose()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <ModalDialog open={open} onClose={handleClose} dialogTitle={`Transfer ${tick}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className={css.transferModalContainer}>
          <div className={css.transferModalFields}>
            <TextField
              required
              label="Amount"
              error={errors?.amount?.message !== undefined}
              // helperText={errors?.amount?.type === 'validUrl' && errors?.appUrl?.message}
              autoComplete="off"
              type="number"
              {...register('amount', {
                required: true,
                max: Number(maxAmount),
                valueAsNumber: true,
              })}
            />
            <TextField
              required
              label="To"
              error={errors?.beneficiary?.message !== undefined}
              helperText={errors?.beneficiary?.type === 'isValidAddress' && errors?.beneficiary?.message}
              autoComplete="off"
              placeholder="0x..."
              {...register('beneficiary', {
                required: true,
                validate: {
                  isValidAddress: (val: string) => (isAddress(val) ? undefined : 'Invalid address'),
                },
              })}
            />
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
                Transfer
              </Button>
            </>
          )}
        </DialogActions>
      </form>
    </ModalDialog>
  )
}

export default TransferInsc20Modal
