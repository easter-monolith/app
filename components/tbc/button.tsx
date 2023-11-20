import { ModalIds } from 'components/modals/modal'
import { WalletContext } from 'components/providers/wallet'
import { getNextAddress, getPublicKey } from 'lib/marina'
import { SubmarineSwap, createSubmarineSwap } from 'lib/swaps'
import { TradeStatus } from 'lib/tdex/constants'
import { CoinPair } from 'lib/tdex/types'
import { fromSatoshis, openModal } from 'lib/utils'
import { networks } from 'liquidjs-lib'
import { useContext, useRef } from 'react'

interface TBCButtonProps {
  FUSDAmount: number
  invoice: string
  pair: CoinPair | undefined
  setTradeError: (arg0: string) => void
  setTradeStatus: (arg0: TradeStatus) => void
}

const TBCButton = ({
  FUSDAmount,
  invoice,
  pair,
  setTradeError,
  setTradeStatus,
}: TBCButtonProps) => {
  const { marina, network } = useContext(WalletContext)

  const activeSwaps = useRef<{ [Identifier: string]: SubmarineSwap }>({})

  if (!marina || !network || !pair) return <></>

  const addToListOfActiveSwaps = (invoice: string, swap: SubmarineSwap) => {
    const swaps = activeSwaps.current
    swaps[invoice] = swap
    activeSwaps.current = swaps
  }

  const removeFromListOfActiveSwaps = (invoice: string) => {
    const swaps = activeSwaps.current
    delete swaps[invoice]
    activeSwaps.current = swaps
  }

  const handleClick = async () => {
    try {
      // open modal
      openModal(ModalIds.Spend)

      // create swap with Boltz.exchange
      setTradeStatus(TradeStatus.SWAPPING)
      const refundPublicKey = (
        await getPublicKey(await getNextAddress())
      ).toString('hex')
      const boltzSwap =
        activeSwaps.current[invoice] ??
        (await createSubmarineSwap(invoice, network, refundPublicKey))
      if (!boltzSwap) throw new Error('Error creating Boltz swap')

      // save swap to list of active swaps
      addToListOfActiveSwaps(invoice, boltzSwap)

      //
      setTradeStatus(TradeStatus.PROPOSING)
      const { address, expectedAmount } = boltzSwap
      console.log('receivingAddress', address)
      const { txid, hex } = await marina.sendTransaction([
        {
          address,
          asset: networks[network].assetHash,
          value: expectedAmount,
        },
      ])

      if (txid) removeFromListOfActiveSwaps(invoice)
    } catch (err) {
      const errMsg = (err as Error).message
      setTradeError(errMsg)
      setTradeStatus(TradeStatus.ERROR)
    }
  }

  const buttonText = FUSDAmount
    ? `Pay ${fromSatoshis(FUSDAmount, pair.from.precision)} FUSD`
    : 'Pay with FUSD'

  return (
    <div className="has-text-centered">
      <button
        className="button is-primary is-cta"
        disabled={!FUSDAmount}
        onClick={handleClick}
      >
        {buttonText}
      </button>
    </div>
  )
}

export default TBCButton
