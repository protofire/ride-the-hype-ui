import { useEffect, useState } from 'react'
import * as siwe from 'siwe'
import { useCurrentChain } from '~/hooks/useChains'
import useWallet from '~/hooks/wallets/useWallet'
import type { ConnectedWallet } from './useOnboard'
import { IndexerApiService } from '~/services/indexer-api'
import type { AuthSignature } from '~/utils/signing'
import { createSiweMessage, removeSignature, retrieveSignature, storeSignature } from '~/utils/signing'
import type { ChainInfo } from '~/types'
import useOnboard from './useOnboard'

enum SignStatus {
  IDLE,
  PENDING,
  COMPLETED,
  ERROR,
}

export const useVerifySignature = () => {
  const chain = useCurrentChain()
  const chainId = chain?.chainId
  const onboard = useOnboard()
  const wallet = useWallet()
  const [signatureStatus, setSignatureStatus] = useState<SignStatus>(SignStatus.IDLE)

  useEffect(() => {
    if (wallet && wallet.chainId === chainId && chain && signatureStatus !== SignStatus.PENDING) {
      setSignatureStatus(SignStatus.PENDING)
      const signature = retrieveSignature(wallet.address)
      if (!signature) {
        signAuth(wallet, chain).then((signed) => {
          if (!signed) {
            onboard?.disconnectWallet({
              label: wallet.label,
            })
            setSignatureStatus(SignStatus.COMPLETED)
          } else {
            setSignatureStatus(SignStatus.ERROR)
          }
        })
      } else {
        verifySignature(signature).then((verified: boolean) => {
          if (!verified) {
            onboard?.disconnectWallet({
              label: wallet.label,
            })
            removeSignature(wallet.address)
            setSignatureStatus(SignStatus.COMPLETED)
          } else {
            setSignatureStatus(SignStatus.ERROR)
          }
        })
        // setSignatureStatus(!verified)
        // if (!verified) {
        //   setWeb3ReadOnly(undefined)
        // }
      }
    }
  }, [wallet, chainId, chain, signatureStatus, onboard])

  //   useEffect(() => {
  //     if (!rpcUri) {
  //       setWeb3ReadOnly(undefined)
  //       return
  //     }
  //     const web3ReadOnly = createWeb3ReadOnly(rpcUri)
  //     setWeb3ReadOnly(web3ReadOnly)
  //   }, [rpcUri])
}

const signAuth = async (wallet: ConnectedWallet, chain: ChainInfo) => {
  const AUTH_MESSAGE = `Optiscriptions is solely an interface and not a virtual assets services provider (e.g., crypto exchange). Transactions involve risk, and you are personally responsible for your actions on Optiscriptions. Acknowledge that the value of any virtual asset (e.g., token) may change, and you bear the risk of potential losses.`
  try {
    const address = wallet.address
    const chainId = wallet.chainId

    const indexerApiService = await IndexerApiService.getInstance(chain)
    const nonce = await indexerApiService.tokensModule.getAddressNonce(address)
    const message = createSiweMessage(address, AUTH_MESSAGE, chainId, nonce.nonce)

    const signature = await wallet.provider.request({
      method: 'personal_sign',
      params: [message, address],
    })
    storeSignature(address, { message: message, signature: signature as string } as AuthSignature)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

const verifySignature = async (authObject: AuthSignature) => {
  const siweObject = new siwe.SiweMessage(authObject.message)
  const data = await siweObject.verify({ signature: authObject.signature })
  return data.success
}
