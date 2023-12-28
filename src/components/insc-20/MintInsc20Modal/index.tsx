import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'
import { useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import { toHex } from 'web3-utils'

import ModalDialog from '~/components/common/ModalDialog'
import type { Insc20, Insc20Balance } from '~/services/indexer-api/types'
import { useCurrentChain } from '~/hooks/useChains'
import { getAssertedChainSigner } from '~/utils/wallets'
//import { ZERO_ADDRESS } from '~/config/constants'
import useOnboard from '~/hooks/wallets/useOnboard'
import CheckWallet from '~/components/common/CheckWallet'

import css from './styles.module.css'
import useAsync from '~/hooks/useAsync'
import { IndexerApiService } from '~/services/indexer-api'
import useWallet from '~/hooks/wallets/useWallet'

interface Props {
  open: boolean
  onClose: () => void
  tick: Insc20['tick']
  maxAmount: Insc20Balance['amount']
  maxMintPerAddress: Insc20Balance['amount']
  maxSupply: Insc20Balance['amount']
  totalSupply: Insc20Balance['amount']
}

type MintInsc20FormData = {
  amount: number
}

const MintInsc20Modal = ({ open, onClose, tick, maxAmount, maxMintPerAddress, maxSupply, totalSupply }: Props) => {
  const currentChain = useCurrentChain()
  const onboard = useOnboard()
  const [loading, setLoading] = useState<boolean>(false)
  const wallet = useWallet()

  //Temporary values
  const page = 1
  const limit = 100

  const [userBalance, balanceDataError, balanceDataLoading] = useAsync(async () => {
    if (!!tick && !!wallet?.address && open) {
      try {
        const indexerApiService = IndexerApiService.getInstance()
        const data = await indexerApiService.tokensModule.getUserHoldings(wallet.address, {
          page,
          limit,
          order: 'desc',
        })
        const balance = data.find((obj) => obj.tick === tick)?.amount ?? 0
        return balance
      } catch (e) {
        console.log(e)
      }
    }
  }, [open, tick, wallet])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    trigger,
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

  useEffect(() => {
    trigger('amount')
  }, [trigger, open])

  const handleClose = () => {
    reset()
    onClose()
  }

  const validateField = (value: number, balance: number | string) => {
    if (+value > +maxAmount) {
      return 'Amount can not exceed maximum value per mint'
    } else if (+value + +balance > +maxMintPerAddress) {
      return `Limit will be exceeded after mint. Current user balance: ${balance}. 
      User is allowed to mint maximum ${+maxMintPerAddress - +balance} until reaching the all time limit.`
    } else if (+value + +totalSupply > +maxSupply) {
      return `Max supply limit will be exceeded. 
      User is allowed to mint maximum ${+maxSupply - +totalSupply} until reaching the max supply limit.`
    } else {
      return true
    }
  }

  return (
    <ModalDialog open={open} onClose={handleClose} dialogTitle={`Mint ${tick}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className={css.mintModalContainer}>
          <div className={css.mintModalFields}>
            <TextField
              required
              label="Amount"
              error={!!errors.amount}
              helperText={errors?.amount?.message}
              autoComplete="off"
              type="number"
              {...register('amount', {
                required: 'Amount can not be empty',
                max: (Number(maxAmount), 'Amount can not exceed max value per mint'),
                validate: (value) => validateField(value, userBalance ?? 0),
              })}
            />
          </div>
        </DialogContent>

        <DialogActions disableSpacing>
          {loading || balanceDataLoading ? (
            <Box width="100%" display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
              {balanceDataLoading && (
                <Typography color="primary" sx={{ pl: 2 }}>
                  checking user data
                </Typography>
              )}
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
