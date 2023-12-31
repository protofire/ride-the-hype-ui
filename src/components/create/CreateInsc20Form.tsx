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
  totalSupply = 'totalSupply',
  limitPerMint = 'limitPerMint',
  limitPerAddress = 'limitPerAddress',
  description = 'description',
}

export type FormData = {
  [FormField.tick]: string
  [FormField.totalSupply]: number
  [FormField.limitPerMint]: number
  [FormField.limitPerAddress]: number
  [FormField.description]: string
}

// TODO: add a validation for already taken ticker
export const CreateInsc20Form = () => {
  const chain = useCurrentChain()
  const onboard = useOnboard()
  const [tx, setTx] = useState<TransactionResponse | undefined>()

  const formMethods = useForm<FormData>({
    mode: 'onChange',
    values: {
      [FormField.tick]: '',
      [FormField.totalSupply]: 21000000,
      [FormField.limitPerMint]: 1000,
      [FormField.limitPerAddress]: 20000,
      [FormField.description]: '',
    },
  })
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = formMethods

  const tick = watch(FormField.tick)
  const totalSupply = watch(FormField.totalSupply)
  const limitPerMint = watch(FormField.limitPerMint)
  const limitPerAddress = watch(FormField.limitPerAddress)
  // const description = watch(FormField.description)

  const onSubmit = handleSubmit(async (data) => {
    if (!onboard || !chain) {
      console.log('Please check you wallet')
      return
    }
    try {
      const signer = await getAssertedChainSigner(onboard, chain?.chainId)

      const txData = {
        p: `${chain.inscriptionPrefix}-20`,
        op: 'deploy',
        tick: data[FormField.tick],
        max: data[FormField.totalSupply],
        lim: data[FormField.limitPerMint],
        wlim: data[FormField.limitPerAddress],
        dec: '0',
        //nonce: (+new Date()).toString(),
        desc: data[FormField.description],
      }

      const dataHex = toHex('data:,' + JSON.stringify(txData))

      const tx = await signer.sendTransaction({
        to: signer.getAddress(),
        value: 0,
        data: dataHex,
      })

      setTx(tx)
      // TODO: add loading
      await tx.wait()
    } catch (e) {
      console.error(e)
    }
  })

  const onReset = (name: FormField) => {
    setValue(name, '')
  }

  const tokenAmountHigher = (prop: string, amount: number, prop2: string, amount2: number) => {
    return amount > amount2 || `${prop} amount can not be lower than ${prop2}`
  }

  return (
    <Paper sx={{ padding: 4, maxWidth: '900px', m: '1rem auto' }}>
      <Grid container direction="row" justifyContent="space-between" spacing={3} mb={2}>
        <Grid item lg={5} xs={12}>
          <Typography variant="h4" fontWeight={700}>
            Deploy {chain?.inscriptionPrefix}-20
          </Typography>
        </Grid>

        <Grid item xs>
          <Typography mb={3}>You can easily deploy a {chain?.inscriptionPrefix}-20 in a few seconds!</Typography>

          <FormProvider {...formMethods}>
            <form onSubmit={onSubmit}>
              <Typography color="secondary" fontWeight={700} mb={2} mt={3}>
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
                {...register(FormField.tick, { required: 'Tick can not be empty' })}
                error={!!errors.tick}
                helperText={errors.tick?.message}
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

              <Typography color="secondary" fontWeight={700} mb={2} mt={3}>
                Total Supply
                <Tooltip
                  placement="top"
                  arrow
                  title="Once your orc-20 supply reaches this figure, new mints won't be indexed"
                >
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
                {...register(FormField.totalSupply, {
                  required: 'Total supply can not be empty',
                  validate: (value) =>
                    tokenAmountHigher(
                      '"Total supply"',
                      +value,
                      '"Max limit per address"',
                      +getValues().limitPerAddress,
                    ),
                })}
                error={!!errors.totalSupply}
                helperText={errors.totalSupply?.message}
                variant="outlined"
                type="number"
                InputProps={{
                  endAdornment: totalSupply ? (
                    <InputAdornment position="end">
                      <Tooltip title="Reset to default value">
                        <IconButton onClick={() => onReset(FormField.totalSupply)} size="small" color="primary">
                          <RotateLeftIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ) : null,
                }}
                fullWidth
              />

              <Typography color="secondary" fontWeight={700} mb={2} mt={3}>
                Limit Per Mint
                <Tooltip placement="top" arrow title="Limit for each mint">
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
                {...register(FormField.limitPerMint, {
                  required: 'Limit per mint can not be empty',
                })}
                variant="outlined"
                type="number"
                error={!!errors.limitPerMint}
                helperText={errors.limitPerMint?.message}
                InputProps={{
                  endAdornment: limitPerMint ? (
                    <InputAdornment position="end">
                      <Tooltip title="Reset to default value">
                        <IconButton onClick={() => onReset(FormField.limitPerMint)} size="small" color="primary">
                          <RotateLeftIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ) : null,
                }}
                fullWidth
              />

              <Typography color="secondary" fontWeight={700} mb={2} mt={3}>
                Limit for each address can maximum mint
                <Tooltip
                  placement="top"
                  arrow
                  title="address balance < this limit (Before mint, please do not receive transfers from others, transfers are also counted as balance)"
                >
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
                {...register(FormField.limitPerAddress, {
                  required: 'Limit per address can not be empty',
                  validate: (value) =>
                    tokenAmountHigher('"Max limit per address"', +value, '"Limit per Mint"', +getValues().limitPerMint),
                })}
                variant="outlined"
                type="number"
                error={!!errors.limitPerAddress}
                helperText={errors.limitPerAddress?.message}
                InputProps={{
                  endAdornment: limitPerAddress ? (
                    <InputAdornment position="end">
                      <Tooltip title="Reset to default value">
                        <IconButton onClick={() => onReset(FormField.limitPerAddress)} size="small" color="primary">
                          <RotateLeftIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ) : null,
                }}
                fullWidth
              />

              <Typography color="secondary" fontWeight={700} mb={2} mt={3}>
                Description (optional)
                <Tooltip
                  placement="top"
                  arrow
                  title="You can provide an optional description for your token. This will appear in the token's metadata"
                >
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
                {...register(FormField.description)}
                variant="outlined"
                type="text"
                InputProps={{
                  endAdornment: limitPerAddress ? (
                    <InputAdornment position="end">
                      <Tooltip title="Reset to default value">
                        <IconButton onClick={() => onReset(FormField.description)} size="small" color="primary">
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
                Deploy
              </Button>
            </form>
          </FormProvider>
        </Grid>
      </Grid>
    </Paper>
  )
}
