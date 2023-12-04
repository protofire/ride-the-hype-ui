import type React from 'react'

declare global {
  interface Window {
    isDesktop?: boolean
    ethereum?: {
      autoRefreshOnNetworkChange: boolean
      isMetaMask: boolean
      _metamask: {
        isUnlocked: () => Promise<boolean>
      }
      isConnected?: () => boolean
    }
    dataLayer?: any[]
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    danger: true
  }
}

declare module '*.svg' {
  const content: any
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  export default content
}

declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_IS_PRODUCTION?: string
    NEXT_PUBLIC_WC_PROJECT_ID?: string
    NEXT_PUBLIC_INDEXER_API_BASE_URL?: string
  }
}

export {}
