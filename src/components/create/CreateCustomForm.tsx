import { FormProvider, useForm } from 'react-hook-form'
import { useState } from 'react'
import { toHex } from 'web3-utils'
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
import CheckWallet from '../common/CheckWallet'
import ContentPaper from '../common/ContentPaper'
import TabsButton from '../common/TabsButton'
import router from 'next/router'
import { AppRoutes } from '~/config/routes'

export enum FormField {
  text = 'text',
}

export type FormData = {
  [FormField.text]: string
}

export const CreateCustomForm = ({ title }: { title?: string }) => {
  const chain = useCurrentChain()
  const onboard = useOnboard()
  const [tx, setTx] = useState<TransactionResponse | undefined>()

  const formMethods = useForm<FormData>({
    mode: 'onChange',
    values: {
      [FormField.text]: '',
    },
  })
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = formMethods

  const text = watch(FormField.text)

  const onSubmit = handleSubmit(async (data) => {
    if (!onboard || !chain) {
      console.log('Please check you wallet')
      return
    }
    try {
      const signer = await getAssertedChainSigner(onboard, chain?.chainId)
      const tx = await signer.sendTransaction({ to: signer.getAddress(), value: 0, data: toHex(text.trim()) })
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

  return (
    <ContentPaper title={title}>
      <Grid container direction="row" justifyContent="space-between" spacing={3} mb={2}>
        <Grid item lg={3} xs={12}>
          <TabsButton
            titles={[`${chain?.inscriptionPrefix.toUpperCase() ?? ''}-20`, 'CUSTOM']}
            onClick={(selected) => {
              switch (selected) {
                case 0: {
                  router.push(AppRoutes.create.index)
                  break
                }
                case 1: {
                  break
                }
              }
            }}
          />
        </Grid>

        <Grid item xs>
          <Typography mb={3}>You can send a custom message to the network in a few seconds!</Typography>

          <FormProvider {...formMethods}>
            <form onSubmit={onSubmit}>
              <Typography color="secondary" fontWeight={700} mb={2} mt={3}>
                Text
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
                {...register(FormField.text, { required: 'Text can not be empty' })}
                error={!!errors.text}
                helperText={errors.text?.message}
                variant="outlined"
                type="text"
                placeholder="4 characters like 'abcd'..."
                multiline
                InputProps={{
                  endAdornment: text ? (
                    <InputAdornment position="end">
                      <Tooltip title="Reset">
                        <IconButton onClick={() => onReset(FormField.text)} size="small" color="primary">
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
              <CheckWallet>
                {(isOk) => (
                  <Button disabled={!isOk} type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Send
                  </Button>
                )}
              </CheckWallet>
            </form>
          </FormProvider>
        </Grid>
      </Grid>
    </ContentPaper>
  )
}
