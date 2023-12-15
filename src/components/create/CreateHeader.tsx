import type { ReactElement, ReactNode } from 'react'

import PageHeader from '~/components/common/PageHeader'
import NavTabs from '~/components/common/NavTabs'
import css from '~/components/common/PageHeader/styles.module.css'
import { createNavItems } from '~/components/sidebar/SidebarNavigation/config'
import { useCurrentChain } from '~/hooks/useChains'
import { useMemo } from 'react'
import { hasFeature } from '~/utils/chains'
import { FEATURES } from '~/types'

const CreateHeader = ({ children }: { children?: ReactNode }): ReactElement => {
  const currentChain = useCurrentChain()

  const navItems = useMemo(() => {
    if (currentChain) {
      return createNavItems.filter((item) => {
        switch (item.featureName) {
          case FEATURES.INSC20:
            return hasFeature(currentChain, FEATURES.INSC20)
          case FEATURES.INSC721:
            return hasFeature(currentChain, FEATURES.INSC721)
          case FEATURES.CUSTOM_INSC:
            return hasFeature(currentChain, FEATURES.CUSTOM_INSC)
          default:
            return true
        }
      })
    }

    return []
  }, [currentChain])

  return (
    <PageHeader
      title="Create a brand new Inscription"
      action={
        <div className={css.pageHeader}>
          <div className={css.navWrapper}>{navItems.length > 1 ? <NavTabs tabs={navItems} /> : null}</div>
          {children && <div className={css.actionsWrapper}>{children}</div>}
        </div>
      }
      titleOnly={false}
    />
  )
}

export default CreateHeader
