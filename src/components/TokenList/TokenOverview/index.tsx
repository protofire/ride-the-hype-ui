import { List, ListItem, ListItemText, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'

const listProperties = [
  {
    id: 'totalSupply',
    label: 'Total Supply',
  },
  {
    id: 'minted',
    label: 'Minted',
  },
  {
    id: 'percentage',
    label: 'Percentage',
  },
  {
    id: 'decimal',
    label: 'Decimal',
  },
  {
    id: 'deployedBy',
    label: 'Deployed By',
  },
  {
    id: 'dateTime',
    label: 'Date Time',
  },
  {
    id: 'percentage',
    label: 'Percentage',
  },
  {
    id: 'holders',
    label: 'Holders',
  },
]

interface Props {
  //fetchAPI or tokenData
}

const TokenOverview = () => {
  const error = null

  return (
    <Paper sx={{ padding: 4, maxWidth: '1200px', m: '1rem auto' }}>
      <List disablePadding>
        {listProperties.map((property) => (
          <ListItem key={property.id} sx={{ py: 1, px: 0 }}>
            <ListItemText primary={property.label} />
            <Typography color="secondary" variant="body2">
              TBA
            </Typography>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default TokenOverview
