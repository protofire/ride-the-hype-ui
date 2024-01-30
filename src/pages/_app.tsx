import '~/styles/globals.css'
import type { AppProps } from 'next/app'
import type { ReactElement } from 'react'
import Head from 'next/head'
import { CacheProvider, type EmotionCache } from '@emotion/react'
import { ThemeProvider } from '@mui/material/styles'

import { StoreHydrator } from '~/store'
import MetaTags from '~/components/common/MetaTags'
import createEmotionCache from '~/utils/createEmotionCache'
import theme from '~/styles/theme/theme'
import { CssBaseline } from '@mui/material'
import PageLayout from '~/components/common/PageLayout'
import { useInitOnboard } from '~/hooks/wallets/useOnboard'
import { useInitSession } from '~/hooks/useInitSession'
import { useInitWeb3 } from '~/hooks/wallets/useInitWeb3'
import useLoadableStores from '~/hooks/useLoadableStores'
import { useVerifySignature } from '~/hooks/wallets/useVerifySignature'

const InitApp = (): null => {
  useInitSession()
  useLoadableStores()
  useInitOnboard()
  useInitWeb3()
  useVerifySignature()

  return null
}

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface CustomAppProps extends AppProps {
  emotionCache?: EmotionCache
}

function CustomApp({
  Component,
  pageProps,
  router,
  emotionCache = clientSideEmotionCache,
}: CustomAppProps): ReactElement {
  return (
    <StoreHydrator>
      <Head>
        <title key="default-title">Inscriptions</title>
        <MetaTags />
      </Head>

      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme('dark')}>
          <CssBaseline />

          <InitApp />

          <PageLayout pathname={router.pathname}>
            <Component {...pageProps} key={router.pathname} />
          </PageLayout>
        </ThemeProvider>
      </CacheProvider>
    </StoreHydrator>
  )
}

export default CustomApp
