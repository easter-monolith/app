import { WalletContext } from 'components/providers/wallet'
import { getNextAddress, getPublicKey } from 'lib/marina'
import { SubmarineSwap, createSubmarineSwap } from 'lib/swaps'
import { networks } from 'liquidjs-lib'
import { useContext, useRef } from 'react'

interface TBCButtonProps {
  amount: number
  fees: number
  invoice: string
}

const TBCButton = ({ amount, fees, invoice }: TBCButtonProps) => {
  const { marina, network } = useContext(WalletContext)

  const activeSwaps = useRef<{ [Identifier: string]: SubmarineSwap }>({})

  if (!marina || !network) return

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
    //
    const refundPublicKey = (
      await getPublicKey(await getNextAddress())
    ).toString('hex')

    // create swap with Boltz.exchange
    const boltzSwap =
      activeSwaps.current[invoice] ??
      (await createSubmarineSwap(invoice, network, refundPublicKey))
    if (!boltzSwap) throw new Error('Error creating swap')

    //
    addToListOfActiveSwaps(invoice, boltzSwap)

    //
    const { address, expectedAmount } = boltzSwap
    const { txid, hex } = await marina.sendTransaction([
      {
        address,
        asset: networks[network].assetHash,
        value: expectedAmount,
      },
    ])

    if (txid) removeFromListOfActiveSwaps(invoice)
  }

  return (
    <div className="has-text-centered">
      <button
        className="button is-primary is-cta"
        disabled={!amount}
        onClick={handleClick}
      >
        Pay with Liquid
      </button>
    </div>
  )
}

export default TBCButton
