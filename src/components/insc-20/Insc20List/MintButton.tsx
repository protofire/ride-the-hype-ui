import type { Insc20 } from '~/services/indexer-api/types'
import type { ReactElement } from 'react'
import CheckWallet from '~/components/common/CheckWallet'
import Button from '@mui/material/Button'
import { useCallback, useState } from 'react'
import { getAssertedChainSigner } from '~/utils/wallets'
import { toHex } from 'web3-utils'
import { ZERO_ADDRESS } from '~/config/constants'
import { useCurrentChain } from '~/hooks/useChains'
import useOnboard from '~/hooks/wallets/useOnboard'

export const MintButton = ({ insc20 }: { insc20: Insc20 }): ReactElement => {
  const chain = useCurrentChain()
  const onboard = useOnboard()
  const [loading, setLoading] = useState(false)

  const mintMax = useCallback(async () => {
    if (!onboard || !chain) {
      console.log('Please check you wallet')
      return
    }

    try {
      setLoading(true)

      const signer = await getAssertedChainSigner(onboard, chain?.chainId)

      const txData = {
        p: `${chain.inscriptionPrefix}-20`,
        op: 'mint',
        tick: insc20.tick,
        amt: insc20.maxMint,
        nonce: (+new Date()).toString(),
      }

      const dataHex = toHex('data:,' + JSON.stringify(txData))

      const tx = await signer.sendTransaction({
        to: ZERO_ADDRESS,
        value: 0,
        data: dataHex,
      })

      await tx.wait()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [chain, insc20.maxMint, insc20.tick, onboard])

  return (
    <CheckWallet>
      {(isOk) => (
        <Button variant="contained" color="primary" size="small" onClick={mintMax} disabled={!isOk || loading}>
          {!loading ? 'Mint' : 'Minting'}
        </Button>
      )}
    </CheckWallet>
  )
}
