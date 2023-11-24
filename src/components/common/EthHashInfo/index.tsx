import { type ReactElement } from 'react'
import useChainId from '~/hooks/useChainId'
import { useAppSelector } from '~/store'
import { selectChainById } from '~/store/chainsSlice'
import { getBlockExplorerLink } from '~/utils/chains'
import SrcEthHashInfo, { type EthHashInfoProps } from './SrcEthHashInfo'

const EthHashInfo = ({
  showName = true,
  avatarSize = 40,
  ...props
}: EthHashInfoProps & { showName?: boolean }): ReactElement => {
  const currentChainId = useChainId()
  const chain = useAppSelector((state) => selectChainById(state, props.chainId || currentChainId))
  const link = chain ? getBlockExplorerLink(chain, props.address) : undefined
  const name = showName ? props.name : undefined
  const showEmoji = props.showAvatar !== false && !props.customAvatar && avatarSize >= 20

  return (
    <SrcEthHashInfo
      prefix={chain?.shortName}
      showPrefix
      copyPrefix={false}
      {...props}
      name={name}
      customAvatar={props.customAvatar}
      ExplorerButtonProps={{ title: link?.title || '', href: link?.href || '' }}
      avatarSize={avatarSize}
      showEmoji={showEmoji}
    >
      {props.children}
    </SrcEthHashInfo>
  )
}

export default EthHashInfo
