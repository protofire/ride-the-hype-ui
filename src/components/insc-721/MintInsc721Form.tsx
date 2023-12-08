import type { FormEventHandler } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { toHex } from 'web3-utils'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Button } from '@mui/material'
import { useCurrentChain } from '~/hooks/useChains'
import useOnboard from '~/hooks/wallets/useOnboard'
import { getAssertedChainSigner } from '~/utils/wallets'
import { ZERO_ADDRESS } from '~/config/constants'
import type { TransactionResponse } from '@ethersproject/abstract-provider'
import EthHashInfo from '~/components/common/EthHashInfo'
import { Insc721FileUpload } from '~/components/insc-721/Insc721FileUpload'
import type { FileInfo } from '~/components/common/FileUpload'
import Link from 'next/link'
import { AppRoutes } from '~/config/routes'

function formatFileSize(size: number) {
  const sizeKb = 1024
  const sizeMb = sizeKb * sizeKb
  const sizeGb = sizeMb * sizeKb
  const sizeTerra = sizeGb * sizeKb

  if (size < sizeMb) {
    const calculatedSizeMb = Number((size / sizeKb).toFixed(2))
    if (calculatedSizeMb <= 0) {
      return size + ' B'
    }
    return calculatedSizeMb + ' KB'
  } else if (size < sizeGb) {
    return (size / sizeMb).toFixed(2) + ' MB'
  } else if (size < sizeTerra) {
    return (size / sizeGb).toFixed(2) + ' GB'
  }

  return ''
}

export const MintInsc721Form = () => {
  const chain = useCurrentChain()
  const onboard = useOnboard()
  const [file, setFile] = useState<File | undefined>()
  const [tx, setTx] = useState<TransactionResponse | undefined>()
  const [txLoading, setTxLoading] = useState<boolean>(false)

  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault()

      if (!onboard || !chain || !file) {
        console.log('Please check you wallet')
        return
      }

      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        const signer = await getAssertedChainSigner(onboard, chain?.chainId)

        const txData = {
          p: `${chain.inscriptionPrefix}-721`,
          op: 'mint',
          'content-type': file.type,
          content: base64,
        }

        const dataHex = toHex('data:application/json,' + JSON.stringify(txData))

        const tx = await signer.sendTransaction({
          to: ZERO_ADDRESS,
          value: 0,
          data: dataHex,
        })

        setTx(tx)
        setTxLoading(true)
        await tx.wait(3)
        setTxLoading(false)
      } catch (e) {
        console.error(e)
      }
    },
    [chain, file, onboard],
  )

  const fileInfo: FileInfo | undefined = useMemo(() => {
    return file
      ? {
          name: file.name,
          additionalInfo: formatFileSize(file.size),
        }
      : undefined
  }, [file])

  const onReset = () => {
    setFile(undefined)
    setTx(undefined)
    setTxLoading(false)
  }

  return (
    <Paper sx={{ padding: 4, maxWidth: '900px', m: '1rem auto' }}>
      <Grid container direction="row" justifyContent="space-between" spacing={3} mb={2}>
        <Grid item lg={5} xs={12}>
          <Typography variant="h4" fontWeight={700}>
            Create an inscription
          </Typography>
        </Grid>

        <Grid item xs>
          {!tx && !txLoading ? (
            <>
              <Typography mb={3}>You can easily mint a {chain?.inscriptionPrefix}-721 in a few seconds!</Typography>

              <form onSubmit={onSubmit}>
                <Insc721FileUpload fileInfo={fileInfo} setFile={setFile} />

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} disabled={!file}>
                  Mint
                </Button>
              </form>
            </>
          ) : null}

          {tx ? (
            <>
              <Typography variant="body2" mb={1}>
                Transaction has been successfully submitted. Approval and addition to the blockchain may take
                approximately 1 minute (8 blocks). Once processed, your inscription will be visible on the{' '}
                <Typography component="span">
                  <Link href={{ pathname: AppRoutes.wallet.ownableInsc721 }}>&quot;My balance&quot;</Link>
                </Typography>{' '}
                page.
              </Typography>
              <EthHashInfo address={tx.hash} showAvatar={false} showCopyButton hasExplorer />
              <Button onClick={onReset} variant="contained" color="primary" sx={{ mt: 2 }}>
                Mint a new one
              </Button>
            </>
          ) : null}
        </Grid>
      </Grid>
    </Paper>
  )
}
