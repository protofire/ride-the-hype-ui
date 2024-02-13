import type { NextPage } from 'next'
import Head from 'next/head'
import { useMemo } from 'react'

// import GeneralHeader from '~/components/GeneralHeader'
import { TransactionList } from '~/components/TransactionList'
import { allInscriptionsNavItems } from '~/components/sidebar/SidebarNavigation/config'
import { useCurrentChain } from '~/hooks/useChains'
import { FEATURES } from '~/types'
import { hasFeature } from '~/utils/chains'

const LatestTransactionsPage: NextPage = () => {
  const currentChain = useCurrentChain()

  const navItems = useMemo(() => {
    if (currentChain) {
      return allInscriptionsNavItems.filter((item) => {
        switch (item.featureName) {
          case FEATURES.INSC20:
            return hasFeature(currentChain, FEATURES.INSC20)
          case FEATURES.INSC721:
            return hasFeature(currentChain, FEATURES.INSC721)
          default:
            return true
        }
      })
    }

    return []
  }, [currentChain])

  return (
    <>
      <Head>
        <title>Latest Inscriptions</title>
      </Head>

      {/* <AllInscriptionsHeader /> */}
      {/* <GeneralHeader title={'Explore all inscriptions'} navItems={navItems} /> */}

      <main>
        <TransactionList />
      </main>
    </>
  )
}

export default LatestTransactionsPage
