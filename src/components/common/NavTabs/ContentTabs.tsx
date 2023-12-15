import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import type { SyntheticEvent, ReactNode } from 'react'
import { useState } from 'react'

function TabContent(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index } = props

  return <div>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>
}

export default function ContentTabs({ children, navItems }: { children?: ReactNode[]; navItems: string[] }) {
  const [value, setValue] = useState(0)

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', pt: 2 }}>
      <Box sx={{ borderBottom: 0, borderColor: 'divider' }} display="flex" justifyContent="center" alignItems="center">
        <Tabs value={value} onChange={handleChange}>
          {navItems.map((item, i) => (
            <Tab key={i} label={item} />
          ))}
        </Tabs>
      </Box>
      {children?.map((child, i) => (
        <TabContent key={i} value={value} index={i}>
          {child}
        </TabContent>
      ))}
    </Box>
  )
}
