import { type ReactElement } from 'react'
import classnames from 'classnames'

import Header from '~/components/common/Header'
import css from './styles.module.css'

const PageLayout = ({ children }: { pathname: string; children: ReactElement }): ReactElement => {
  return (
    <>
      <header className={css.header}>
        <Header />
      </header>

      <div className={classnames(css.main)}>
        <div className={css.content}>{children}</div>
      </div>
    </>
  )
}

export default PageLayout
