import type { ReactElement, ReactNode } from 'react'

import PageHeader from '~/components/common/PageHeader'
import NavTabs from '~/components/common/NavTabs'
import css from '~/components/common/PageHeader/styles.module.css'
import { insc721NavItems } from '~/components/sidebar/SidebarNavigation/config'

const Insc721Header = ({ children }: { children?: ReactNode }): ReactElement => {
  return (
    <PageHeader
      title="Inscriptions 721"
      action={
        <div className={css.pageHeader}>
          <div className={css.navWrapper}>
            <NavTabs tabs={insc721NavItems} />
          </div>
          {children && <div className={css.actionsWrapper}>{children}</div>}
        </div>
      }
    />
  )
}

export default Insc721Header
