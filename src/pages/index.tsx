import AllInsc20Page from 'src/pages/all-inscriptions'
export default AllInsc20Page

// import Box from '@mui/material/Box'
//
// import Head from 'next/head'
// import { Typography } from '@mui/material'
// import { useEffect, useLayoutEffect } from 'react'
// import { useRouter } from 'next/router'
// import { AppRoutes } from '~/config/routes'
//
// const useIsomorphicEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect
//
// export default function Home() {
//   const router = useRouter()
//
//   useIsomorphicEffect(() => {
//     if (router.pathname !== AppRoutes.index) {
//       return
//     }
//
//     void router.replace(AppRoutes.allInscriptions)
//   }, [router])
//
//   return (
//     <>
//       <Head>
//         <title>Welcome to Inscriptions</title>
//       </Head>
//
//       <main>
//         <Box display="flex" justifyContent="center" marginTop="1rem">
//           <Typography variant="h1" fontSize={[44, null, 52]} lineHeight={1} color="static.main">
//             Welcome to Inscriptions!
//           </Typography>
//         </Box>
//       </main>
//     </>
//   )
// }
