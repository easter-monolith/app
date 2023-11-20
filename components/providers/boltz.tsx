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
  calcBoltzFees: (amountInSats: number) => number
  getBoltzFees: () => any
  getBoltzLimits: () => any
  isBoltzAmountOutOfBounds: (amountInSats: number) => boolean
}

export const BoltzContext = createContext<BoltzContextProps>({
  calcBoltzFees: () => 0,
  getBoltzFees: () => {},
  getBoltzLimits: () => {},
  isBoltzAmountOutOfBounds: () => true,
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

  const getBoltzFees = () => ({
    minersFees: pair?.fees.minerFees.baseAsset.normal || 0,
    percentage: pair?.fees.percentageSwapIn || 0,
  })

  const calcBoltzFees = (amountInSats: number): number => {
    const { minersFees, percentage } = getBoltzFees()
    return Decimal.ceil(
      new Decimal(amountInSats).mul(percentage).div(100).add(minersFees),
    ).toNumber()
  }

  const getBoltzLimits = () => pair?.limits

  const isBoltzAmountOutOfBounds = (amount: number): boolean => {
    if (!pair) return true
    return amount > pair.limits.maximal || amount < pair.limits.minimal
  }

  return (
    <BoltzContext.Provider
      value={{
        calcBoltzFees,
        getBoltzFees,
        getBoltzLimits,
        isBoltzAmountOutOfBounds,
      }}
    >
      {children}
    </BoltzContext.Provider>
  )
}
