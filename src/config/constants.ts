export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true'
export const LS_NAMESPACE = 'PoC__'
export const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || ''

// TODO: update
export const TREZOR_APP_URL = 'https://www.blocknative.com'
export const TREZOR_EMAIL = 'test@test.com'
export const EMPTY_DATA = '0x'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const INDEXER_API_BASE_URL =
  process.env.NEXT_PUBLIC_INDEXER_API_BASE_URL || 'https://inscriptions-api.protofire.io'
