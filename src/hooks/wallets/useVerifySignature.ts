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
import { setAuthStatus } from '~/store/authSlice'
import { useAppDispatch } from '~/store'
import { PROJECT_NAME } from '~/config/constants'

export enum SignStatus {
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
  const dispatch = useAppDispatch()
  const [pendingSignature, setPending] = useState(false)

  useEffect(() => {
    if (wallet && wallet.chainId === chainId && chain && !pendingSignature) {
      setPending(true)
      dispatch(setAuthStatus(SignStatus.PENDING))
      const signature = retrieveSignature(wallet.address)
      if (!signature) {
        signAuth(wallet, chain).then((signed) => {
          if (!signed) {
            onboard?.disconnectWallet({
              label: wallet.label,
            })
            setPending(false)
            dispatch(setAuthStatus(SignStatus.ERROR))
          } else {
            setPending(false)
            dispatch(setAuthStatus(SignStatus.COMPLETED))
          }
        })
      } else {
        verifySignature(signature).then((verified: boolean) => {
          if (!verified) {
            onboard?.disconnectWallet({
              label: wallet.label,
            })
            removeSignature(wallet.address)
            setPending(false)
            dispatch(setAuthStatus(SignStatus.ERROR))
          } else {
            setPending(false)
            dispatch(setAuthStatus(SignStatus.COMPLETED))
          }
        })
      }
    }
  }, [wallet, chainId, chain, onboard, dispatch, pendingSignature])
}

const signAuth = async (wallet: ConnectedWallet, chain: ChainInfo) => {
  const AUTH_MESSAGE = `${PROJECT_NAME} is solely an interface and not a virtual assets services provider (e.g., crypto exchange). Transactions involve risk, and you are personally responsible for your actions on ${PROJECT_NAME}. Acknowledge that the value of any virtual asset (e.g., token) may change, and you bear the risk of potential losses.`
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
