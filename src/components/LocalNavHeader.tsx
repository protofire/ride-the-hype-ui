import { useState, type ReactElement } from 'react'

import PageHeader from '~/components/common/PageHeader'
import css from '~/components/common/PageHeader/styles.module.css'
import LocalTabs from './common/NavTabs/LocalTabs'

const LocalNavHeader = ({
  title,
  navTitles,
  navContent,
}: {
  title: string
  navTitles: string[] | []
  navContent: JSX.Element[]
}): ReactElement => {
  const [navIndex, setNavIndex] = useState(0)
  return (
    <>
      <PageHeader
        title={title}
        action={
          <div className={css.pageHeader}>
            <div className={css.navWrapper}>
              {navTitles.length > 1 ? <LocalTabs tabs={navTitles} setNavIndex={setNavIndex} /> : null}
            </div>
          </div>
        }
        titleOnly={navTitles.length <= 1}
      />
      <main>{navContent[navIndex]}</main>
    </>
  )
}

export default LocalNavHeader
