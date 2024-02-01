import type { Dispatch, SetStateAction, SyntheticEvent } from 'react'
import React, { useState } from 'react'
import { type LinkProps as NextLinkProps } from 'next/link'
import { Tab, Tabs, type TabProps, Typography } from '@mui/material'

import css from './styles.module.css'

type Props = TabProps & NextLinkProps

const LocalTabs = ({ tabs, setNavIndex }: { tabs: string[]; setNavIndex: Dispatch<SetStateAction<number>> }) => {
  const [value, setValue] = useState(0)

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
    setNavIndex(newValue)
  }

  return (
    <Tabs onChange={handleChange} value={value} variant="scrollable" allowScrollButtonsMobile className={css.tabs}>
      {tabs.map((tab, idx) => (
        <Tab
          key={idx}
          label={
            <Typography variant="body2" fontWeight={700} className={css.label}>
              {tab}
            </Typography>
          }
        />

        // <Tab
        //   component={NextLinkComposed}
        //   key={tab.href}
        //   href={{ pathname: tab.href }}
        //   className={css.tab}
        //   label={
        //     <Typography
        //       variant="body2"
        //       fontWeight={700}
        //       color={activeTab === idx ? 'primary' : 'primary.light'}
        //       className={css.label}
        //     >
        //       {tab.label}
        //     </Typography>
        //   }
        // />
      ))}
    </Tabs>
  )
}

export default LocalTabs
