import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'
import { useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { toHex } from 'web3-utils'

import ModalDialog from '~/components/common/ModalDialog'
import type { Insc20, Insc20Balance } from '~/services/indexer-api/types'
import { useCurrentChain } from '~/hooks/useChains'
import { getAssertedChainSigner } from '~/utils/wallets'
import { ZERO_ADDRESS } from '~/config/constants'
import useOnboard from '~/hooks/wallets/useOnboard'
import CheckWallet from '~/components/common/CheckWallet'

import css from './styles.module.css'

interface Props {
  open: boolean
  onClose: () => void
  tick: Insc20['tick']
  maxAmount: Insc20Balance['amount']
}

type MintInsc20FormData = {
  amount: number
}

const MintInsc20Modal = ({ open, onClose, tick, maxAmount }: Props) => {
  const currentChain = useCurrentChain()
  const onboard = useOnboard()
  const [loading, setLoading] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<MintInsc20FormData>({ defaultValues: { amount: Number(maxAmount) }, mode: 'onChange' })

  const onSubmit: SubmitHandler<MintInsc20FormData> = async (data, __) => {
    if (!onboard || !currentChain) {
      console.log('Please check you wallet')
      return
    }

    try {
      setLoading(true)
      const signer = await getAssertedChainSigner(onboard, currentChain?.chainId)

      const txData = {
        p: `${currentChain.inscriptionPrefix}-20`,
        op: 'mint',
        tick,
        amt: data.amount,
        nonce: (+new Date()).toString(),
      }

      const dataHex = toHex('data:,' + JSON.stringify(txData))

      const tx = await signer.sendTransaction({
        to: ZERO_ADDRESS,
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
    <ModalDialog open={open} onClose={handleClose} dialogTitle={`Mint $${tick}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className={css.mintModalContainer}>
          <div className={css.mintModalFields}>
            <TextField
              required
              label="Amount"
              error={errors?.amount?.message !== undefined}
              autoComplete="off"
              type="number"
              {...register('amount', {
                required: true,
                max: Number(maxAmount),
                valueAsNumber: true,
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

              <CheckWallet>
                {(isOk) => (
                  <Button type="submit" variant="contained" disabled={!isOk || !isValid}>
                    Mint
                  </Button>
                )}
              </CheckWallet>
            </>
          )}
        </DialogActions>
      </form>
    </ModalDialog>
  )
}

export default MintInsc20Modal
