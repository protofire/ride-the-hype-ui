import type { ReactElement, ReactNode } from 'react'

import PageHeader from '~/components/common/PageHeader'
import NavTabs from '~/components/common/NavTabs'
import css from '~/components/common/PageHeader/styles.module.css'
import { insc20NavItems } from '~/components/sidebar/SidebarNavigation/config'

const Insc20Header = ({ children }: { children?: ReactNode }): ReactElement => {
  return (
    <PageHeader
      title="Inscriptions 20"
      action={
        <div className={css.pageHeader}>
          <div className={css.navWrapper}>
            <NavTabs tabs={insc20NavItems} />
          </div>
          {children && <div className={css.actionsWrapper}>{children}</div>}
        </div>
      }
    />
  )
}

export default Insc20Header
