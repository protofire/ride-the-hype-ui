import type { ReactElement, ReactNode } from 'react'

import PageHeader from '~/components/common/PageHeader'
import NavTabs from '~/components/common/NavTabs'
import css from '~/components/common/PageHeader/styles.module.css'
import { walletNavItems } from '~/components/sidebar/SidebarNavigation/config'
import { useCurrentChain } from '~/hooks/useChains'
import { useMemo } from 'react'
import { FEATURES } from '~/types'
import { hasFeature } from '~/utils/chains'

const WalletHeader = ({ children }: { children?: ReactNode }): ReactElement => {
  const currentChain = useCurrentChain()

  const navItems = useMemo(() => {
    if (currentChain) {
      return walletNavItems.filter((item) => {
        switch (item.featureName) {
          case FEATURES.INSC20:
            return hasFeature(currentChain, FEATURES.INSC20)
          case FEATURES.INSC721:
            return hasFeature(currentChain, FEATURES.INSC721)
          default:
            return true
        }
      })
    }

    return []
  }, [currentChain])

  return (
    <PageHeader
      title="Your inscriptions"
      action={
        <div className={css.pageHeader}>
          <div className={css.navWrapper}>{navItems.length > 1 ? <NavTabs tabs={navItems} /> : null}</div>
          {children && <div className={css.actionsWrapper}>{children}</div>}
        </div>
      }
    />
  )
}

export default WalletHeader
