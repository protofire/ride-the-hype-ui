import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useAsync from '~/hooks/useAsync'
// import { IndexerApiService } from '~/services/indexer-api'
import { AppRoutes } from '~/config/routes'

const Inscription = () => {
  const router = useRouter()
  const inscription = useAsync(async () => {
    return undefined
    // if (!router.query.id || !(typeof router.query.id === 'string')) return undefined
    //
    // const indexerApiService = IndexerApiService.getInstance()
    // return indexerApiService.getInscriptionByHash(router.query.id)
  }, [])

  useEffect(() => {
    if (!router.query.id || !(typeof router.query.id === 'string')) {
      void router.push(AppRoutes.insc721.mint)
    }
  }, [router])

  return <>{inscription}</>
}

export default Inscription
