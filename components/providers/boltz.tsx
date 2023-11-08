import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { WalletContext } from './wallet'
import Boltz, { GetPairResponse } from 'lib/boltz'
import { NetworkString } from 'marina-provider'
import Decimal from 'decimal.js'

interface BoltzContextProps {
  getBoltzFees: (amountInSats: number, to: string) => number
}

export const BoltzContext = createContext<BoltzContextProps>({
  getBoltzFees: () => 0,
})

export const BoltzProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useContext(WalletContext)
  const [pair, setPair] = useState<GetPairResponse>()

  const getFees = async (network: NetworkString) => {
    const boltz = new Boltz(network)
    const boltzPair = await boltz.getPair('L-BTC/BTC')
    if (!boltzPair) return
    setPair(boltzPair)
  }

  useEffect(() => {
    if (network) getFees(network)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network])

  const getBoltzFees = (amountInSats: number, to: string): number => {
    if (!pair) return 0
    let minersFees = 0
    let percentage = 0
    if (to === 'lightning') {
      minersFees = pair.fees.minerFees.baseAsset.normal
      percentage = pair.fees.percentageSwapIn
    } else if (to === 'liquid') {
      const reverse = pair.fees.minerFees.baseAsset.reverse
      minersFees = reverse.claim + reverse.lockup
      percentage = pair.fees.percentage
    }
    return Decimal.ceil(
      new Decimal(amountInSats).mul(percentage).div(100).add(minersFees),
    ).toNumber()
  }

  return (
    <BoltzContext.Provider value={{ getBoltzFees }}>
      {children}
    </BoltzContext.Provider>
  )
}
