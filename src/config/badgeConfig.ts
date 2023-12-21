import GoldenBadge from '~/public/images/badges/golden-badge.png'
import SilverBadge from '~/public/images/badges/silver-badge.png'
import FireBadge from '~/public/images/badges/on-fire-badge.png'
import HotBadge from '~/public/images/badges/hot-badge.png'
import DecentralizedBadge from '~/public/images/badges/decentralized-badge.png'

export enum Badge {
  GOLDEN_BADGE = 'Golden Badge',
  SILVER_BADGE = 'Silver Badge',
  FIRE_BADGE = 'On Fire Badge',
  HOT_BADGE = 'hot24h',
  DECENTRALIZED_BADGE = 'decentralized',
}

export const BADGE_CONFIG = {
  [Badge.GOLDEN_BADGE]: { description: '1st Fully Minted!', icon: GoldenBadge },
  [Badge.SILVER_BADGE]: { description: '2nd Fully Minted!', icon: SilverBadge },
  [Badge.FIRE_BADGE]: { description: 'On Fire! Most transactions within the last hour', icon: FireBadge },
  [Badge.HOT_BADGE]: { description: 'Hot. Most transactions in the past 24 hours', icon: HotBadge },
  [Badge.DECENTRALIZED_BADGE]: { description: 'Decentralized! Largest number of holders', icon: DecentralizedBadge },
}
export interface KnownBadges {
  [key: string]: Badge[]
}

export const KNOWN_BADGES: KnownBadges = {
  osct: [Badge.GOLDEN_BADGE],
  opti: [Badge.SILVER_BADGE],
}
