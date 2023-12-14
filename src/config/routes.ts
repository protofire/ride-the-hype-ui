export const AppRoutes = {
  index: '/',
  allInscriptions: {
    index: '/all-inscriptions',
    allInsc721: '/all-inscriptions/all-insc-721',
    allInsc20: '/all-inscriptions/all-insc-20',
  },
  tokens: {
    index: '/tokens',
    allInsc721: '/tokens/insc-721',
    allInsc20: '/tokens/insc-20',
  },
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
    ownableInsc20: '/wallet/ownable-insc-20',
    index: '/wallet',
  },
}
