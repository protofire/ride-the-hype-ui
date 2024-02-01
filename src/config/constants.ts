import * as process from 'process'

export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === 'true'
export const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || ''

// TODO: update
export const TREZOR_APP_URL = 'https://www.blocknative.com'
export const TREZOR_EMAIL = 'test@test.com'
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const DEFAULT_INDEXER_API_BASE_URL = process.env.NEXT_PUBLIC_INDEXER_API_BASE_URL || ''

export const SOCIALS = {
  TWITTER: 'https://twitter.com/optiscriptions',
  TELEGRAM: 'https://t.me/optiscriptions',
  DOCS: 'https://docs.optiscriptions.io',
}

// Magic numbers
export const POLLING_INTERVAL = Number(process.env.NEXT_PUBLIC_POLLING_INTERVAL) || 15_000
export const EMPTY_DATA = '0x'
export const LS_NAMESPACE = 'PoC__'
