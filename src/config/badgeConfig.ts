import GoldenBadge from '~/public/images/badges/golden-badge.png'
import SilverBadge from '~/public/images/badges/silver-badge.png'
import BronzeBadge from '~/public/images/badges/golden-badge.png'

enum Badge {
  GOLDEN_BADGE = 'Golden Badge',
  SILVER_BADGE = 'Silver Badge',
  BRONZE_BADGE = 'Bronze Badge',
}

export const BADGE_CONFIG = {
  [Badge.GOLDEN_BADGE]: { description: '1st Fully Minted!', icon: GoldenBadge },
  [Badge.SILVER_BADGE]: { description: '2nd Fully Minted!', icon: SilverBadge },
  [Badge.BRONZE_BADGE]: { description: '3rd Fully Minted!', icon: BronzeBadge },
}
export interface KnownBadges {
  [key: string]: Badge[]
}

export const KNOWN_BADGES: KnownBadges = {
  osct: [Badge.GOLDEN_BADGE],
  opti: [Badge.SILVER_BADGE],
}
