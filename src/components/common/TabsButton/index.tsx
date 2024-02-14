import { Button } from '@mui/material'
import css from './styles.module.css'
import { useState } from 'react'

const buttonConfig = {
  2: [{ className: [css.tabButton1] }, { className: [css.tabButton2] }],
  3: [{ className: [css.tabButton1] }, { className: [css.tabButton2B] }, { className: [css.tabButton3] }],
}

const TabsButton = ({
  titles,
  onClick,
  selectedIdx,
}: {
  titles: [string, string, string?]
  onClick: (selected: number) => void
  selectedIdx?: number
}) => {
  const [selected, setSelected] = useState(selectedIdx ?? 0)
  return (
    <div>
      {titles.map((title, index) => (
        <Button
          key={index}
          color={'primary'}
          onClick={() => {
            setSelected(index)
            onClick(index)
          }}
          size="small"
          className={`${buttonConfig[titles.length][index].className[0]} ${selected === index ? css.selected : ''}`}
        >
          {title}
        </Button>
      ))}
    </div>
  )
}

export default TabsButton
