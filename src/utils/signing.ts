import * as siwe from 'siwe'

export const marketplaceDomainEIP712 = (chainId: string, marketplace?: string) => {
  return {
    name: 'OSC20Market',
    version: '1.0',
    chainId: chainId,
    verifyingContract: marketplace || '0x0669a33d90fd01d5f26f9fae04bcea81c190557e',
  }
}

export const marketplaceTypesEIP712 = {
  OSC20Order: [
    { name: 'seller', type: 'address' },
    { name: 'creator', type: 'address' },
    { name: 'listId', type: 'bytes32' },
    { name: 'ticker', type: 'string' },
    { name: 'amount', type: 'uint256' },
    { name: 'price', type: 'uint256' },
    { name: 'listingTime', type: 'uint64' },
    { name: 'expirationTime', type: 'uint64' },
    { name: 'creatorFeeRate', type: 'uint16' },
    { name: 'salt', type: 'uint32' },
  ],
}

export function createSiweMessage(address: string, statement: string, chainId: string, nonce: string) {
  const siweMessage = createSiweObject(address, statement, chainId, nonce)
  return siweMessage.prepareMessage()
}

export function createSiweObject(address: string, statement: string, chainId: string, nonce: string) {
  return new siwe.SiweMessage({
    domain: window.location.host,
    address,
    statement,
    uri: window.location.origin,
    version: '1',
    chainId: +chainId,
    nonce: nonce,
  })
}

export type AuthSignature = {
  message: string
  signature: string
}
export function storeSignature(address: string, signature: AuthSignature) {
  const signatures = JSON.parse(localStorage.getItem('signature') || '{}')
  signatures[address] = signature
  localStorage.setItem('signature', JSON.stringify(signatures))
}

export function retrieveSignature(address: string): AuthSignature {
  const signatures = JSON.parse(localStorage.getItem('signature') || '{}')
  return signatures[address] ?? undefined
}

export function removeSignature(address: string) {
  const signatures = JSON.parse(localStorage.getItem('signature') || '{}')
  delete signatures[address]
  localStorage.setItem('signature', JSON.stringify(signatures))
}
