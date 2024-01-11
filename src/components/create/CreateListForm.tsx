import { FormProvider, useForm } from 'react-hook-form'
import { useState } from 'react'
import { toHex } from 'web3-utils'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import { Button, IconButton } from '@mui/material'
import RotateLeftIcon from '@mui/icons-material/RotateLeft'
import { useCurrentChain } from '~/hooks/useChains'
import useOnboard from '~/hooks/wallets/useOnboard'
import InfoIcon from '~/public/images/info.svg'
import { getAssertedChainSigner } from '~/utils/wallets'
//import { ZERO_ADDRESS } from '~/config/constants'
import type { TransactionResponse } from '@ethersproject/abstract-provider'
import EthHashInfo from '~/components/common/EthHashInfo'

export enum FormField {
  tick = 'tick',
  amount = 'amount',
}

export type FormData = {
  [FormField.tick]: string
  [FormField.amount]: number
}

export const CreateListForm = () => {
  const chain = useCurrentChain()
  const onboard = useOnboard()
  const [tx, setTx] = useState<TransactionResponse | undefined>()

  const formMethods = useForm<FormData>({
    mode: 'onChange',
    values: {
      [FormField.tick]: '',
      [FormField.amount]: 0,
    },
  })
  const { register, handleSubmit, setValue, watch } = formMethods

  const tick = watch(FormField.tick)
  const amount = watch(FormField.amount)

  const onSubmit = handleSubmit(async (data) => {
    if (!onboard || !chain) {
      console.log('Please check you wallet')
      return
    }

    try {
      const signer = await getAssertedChainSigner(onboard, chain?.chainId)

      const txData = {
        p: `${chain.inscriptionPrefix}-20`,
        op: 'list',
        tick: data[FormField.tick],
        amt: data[FormField.amount],
        //nonce: (+new Date()).toString(),
      }

      const dataHex = toHex('data:,' + JSON.stringify(txData))

      const tx = await signer.sendTransaction({
        to: '0x0669a33D90FD01d5f26f9FAe04BcEa81c190557e',
        value: 0,
        data: dataHex,
      })

      setTx(tx)
      await tx.wait()
    } catch (e) {
      console.error(e)
    }
  })

  const onReset = (name: FormField) => {
    setValue(name, '')
  }

  return (
    <Paper sx={{ padding: 4, maxWidth: '900px', m: '1rem auto' }}>
      <Grid container direction="row" justifyContent="space-between" spacing={3} mb={2}>
        <Grid item lg={5} xs={12}>
          <Typography variant="h4" fontWeight={700}>
            List {chain?.inscriptionPrefix}-20
          </Typography>
        </Grid>

        <Grid item xs>
          <Typography mb={3}>You can list for sell a {chain?.inscriptionPrefix}-20 in a few seconds!</Typography>

          <FormProvider {...formMethods}>
            <form onSubmit={onSubmit}>
              <Typography fontWeight={700} mb={2} mt={3}>
                Tick
                <Tooltip placement="top" arrow title="case-sensitive">
                  <span>
                    <SvgIcon
                      component={InfoIcon}
                      inheritViewBox
                      fontSize="small"
                      color="border"
                      sx={{ verticalAlign: 'middle', ml: 0.5 }}
                    />
                  </span>
                </Tooltip>
              </Typography>

              <TextField
                {...register(FormField.tick)}
                variant="outlined"
                type="text"
                placeholder="4 characters like 'abcd'..."
                InputProps={{
                  endAdornment: tick ? (
                    <InputAdornment position="end">
                      <Tooltip title="Reset">
                        <IconButton onClick={() => onReset(FormField.tick)} size="small" color="primary">
                          <RotateLeftIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ) : null,
                }}
                fullWidth
              />

              <Typography fontWeight={700} mb={2} mt={3}>
                Amount
              </Typography>

              <TextField
                {...register(FormField.amount)}
                variant="outlined"
                type="number"
                InputProps={{
                  endAdornment: amount ? (
                    <InputAdornment position="end">
                      <Tooltip title="Reset value">
                        <IconButton onClick={() => onReset(FormField.amount)} size="small" color="primary">
                          <RotateLeftIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ) : null,
                }}
                fullWidth
              />

              {tx !== undefined ? (
                <EthHashInfo address={tx.hash} showAvatar={false} showCopyButton hasExplorer />
              ) : null}

              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                List
              </Button>
            </form>
          </FormProvider>
        </Grid>
      </Grid>
    </Paper>
  )
}
