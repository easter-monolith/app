import NotAllowed from 'components/messages/notAllowed'
import { EnabledTasks, Tasks } from 'lib/tasks'
import { NextPage } from 'next'
import TBC from 'components/tbc'
import { useContext } from 'react'
import { WalletContext } from 'components/providers/wallet'
import OnlyMainnet from 'components/messages/onlyMainnet'

const TheBitcoinCompany: NextPage = () => {
  const { network } = useContext(WalletContext)

  if (network != 'liquid') return <OnlyMainnet />
  if (!EnabledTasks[Tasks.TBC]) return <NotAllowed />

  return <TBC />
}

export default TheBitcoinCompany
