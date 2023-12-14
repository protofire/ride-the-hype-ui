import type { ReactElement, ReactNode } from 'react'
import { useMemo } from 'react'

import PageHeader from '~/components/common/PageHeader'
import NavTabs from '~/components/common/NavTabs'
import css from '~/components/common/PageHeader/styles.module.css'
import { allInscriptionsNavItems } from '~/components/sidebar/SidebarNavigation/config'
import { useCurrentChain } from '~/hooks/useChains'
import { hasFeature } from '~/utils/chains'
import { FEATURES } from '~/types'

const AllInscriptionsHeader = ({ children }: { children?: ReactNode }): ReactElement => {
  const currentChain = useCurrentChain()

  const navItems = useMemo(() => {
    if (currentChain) {
      return allInscriptionsNavItems.filter((item) => {
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
      title="Explore all inscriptions"
      action={
        <div className={css.pageHeader}>
          <div className={css.navWrapper}>{navItems.length > 1 ? <NavTabs tabs={navItems} /> : null}</div>
          {children && <div className={css.actionsWrapper}>{children}</div>}
        </div>
      }
    />
  )
}

export default AllInscriptionsHeader
