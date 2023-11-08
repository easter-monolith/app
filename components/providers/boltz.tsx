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
  getBoltzFees: (amountInSats: number) => number
}

export const BoltzContext = createContext<BoltzContextProps>({
  getBoltzFees: () => 0,
})

export const BoltzProvider = ({ children }: { children: ReactNode }) => {
  const { network } = useContext(WalletContext)
  const [pair, setPair] = useState<GetPairResponse>()

  const getPair = async (network: NetworkString) => {
    const boltz = new Boltz(network)
    const boltzPair = await boltz.getPair('L-BTC/BTC')
    if (!boltzPair) return
    setPair(boltzPair)
  }

  useEffect(() => {
    if (network) getPair(network)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network])

  const getBoltzFees = (amountInSats: number): number => {
    if (!pair) return 0
    const minersFees = pair.fees.minerFees.baseAsset.normal || 0
    const percentage = pair.fees.percentageSwapIn || 0
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
