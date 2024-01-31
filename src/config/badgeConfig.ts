import GoldenBadge from '~/public/images/badges/golden-badge.png'
import SilverBadge from '~/public/images/badges/silver-badge.png'
import FireBadge from '~/public/images/badges/on-fire-badge.png'
import Hot24hBadge from '~/public/images/badges/hot-24h-badge.png'
import DecentralizedBadge from '~/public/images/badges/decentralized-badge.png'

export interface KnownBadges {
  [key: string]: { [key: string]: Badge[] }
}

export enum Badge {
  GOLDEN_BADGE = 'Golden Badge',
  SILVER_BADGE = 'Silver Badge',
  HOT_24H_BADGE = 'hot24h',
  FIRE_BADGE = 'hot1h',
  DECENTRALIZED_BADGE = 'decentralized',
}

export const BADGE_CONFIG = {
  [Badge.GOLDEN_BADGE]: { description: '1st Fully Minted!', icon: GoldenBadge },
  [Badge.SILVER_BADGE]: { description: '2nd Fully Minted!', icon: SilverBadge },
  [Badge.HOT_24H_BADGE]: { description: 'Hot. Most transactions in the past 24 hours', icon: Hot24hBadge },
  [Badge.FIRE_BADGE]: { description: 'On Fire! Most transactions within the last hour', icon: FireBadge },
  [Badge.DECENTRALIZED_BADGE]: { description: 'Decentralized! Largest number of holders', icon: DecentralizedBadge },
}

export const KNOWN_BADGES: KnownBadges = {
  '10': {
    osct: [Badge.GOLDEN_BADGE],
    opti: [Badge.SILVER_BADGE],
  },
}

export function retrieveKnownBadges(chainId: string, tick: string): Badge[] {
  const chainConfig = KNOWN_BADGES[chainId]
  return chainConfig && chainConfig[tick] ? chainConfig[tick] : []
}
