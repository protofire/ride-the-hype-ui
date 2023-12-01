import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import z from 'zod'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { INDEXER_API_URL } from '~/config/constants'
import useWallet from '~/hooks/wallets/useWallet'
import useChainId from '~/hooks/useChainId'
import { useAppSelector } from '~/store'
import { selectChainById } from '~/store/chainsSlice'
import { getBlockExplorerLink } from '~/utils/chains'

const Inscription = z.object({
  id: z.number().int(),
  hash: z.string(),
  creator: z.string(),
  content: z.string(),
  createdAt: z.string(),
})

type Inscription = z.infer<typeof Inscription>

export const Insc721Wallet = () => {
  const [inscriptions, setInscriptions] = useState([] as Inscription[])
  const wallet = useWallet()

  const currentChainId = useChainId()
  const chain = useAppSelector((state) => selectChainById(state, currentChainId))

  useEffect(() => {
    if (wallet) {
      const fetchInscriptions = async () => {
        const url = `${INDEXER_API_URL}/users/${wallet.address}/inscriptions`
        const res = await fetch(url)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(JSON.stringify(data, null, 2))
        }
        setInscriptions(Inscription.array().parse(data))
      }

      fetchInscriptions().catch(console.error)
    }
  }, [wallet])

  return (
    <Paper sx={{ padding: 4, maxWidth: '900px', m: '1rem auto' }}>
      <Grid container direction="row" spacing={3} mb={2}>
        {inscriptions.map((item) => (
          <Grid item lg={5} xs={12} key={item.id}>
            <Link
              href={chain ? getBlockExplorerLink(chain, item.hash)?.href || '' : ''}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: '100%', height: 'auto' }}
                src={item.content}
                alt={item.hash}
              />
            </Link>
          </Grid>
        ))}
      </Grid>
      <div />
    </Paper>
  )
}
