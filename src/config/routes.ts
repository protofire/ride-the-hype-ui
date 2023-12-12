export const AppRoutes = {
  index: '/',
  allInscriptions: '/all-inscriptions',
  create: {
    insc721: '/create/insc-721',
    insc20: '/create/insc-20',
    index: '/create',
    custom: '/create/custom',
  },
  insc20: {
    transfer: '/insc-20/transfer',
    mint: '/insc-20/mint',
    index: '/insc-20',
    create: '/insc-20/create',
  },
  insc721: {
    mint: '/insc-721/mint',
    inscriptionDetails: '/insc-721/inscription-details',
    index: '/insc-721',
  },
  wallet: {
    ownableInsc721: '/wallet/ownable-insc-721',
    index: '/wallet',
  },
}
