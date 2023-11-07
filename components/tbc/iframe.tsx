import { WalletContext } from 'components/providers/wallet'
import { submarineSwapBoltzFees } from 'lib/swaps'
import { toSatoshis } from 'lib/utils'
import { useContext, useEffect } from 'react'

interface TBCIFrameProps {
  setPayment: (arg0: any) => void
}

const TBCIFrame = ({ setPayment }: TBCIFrameProps) => {
  const iframe_host = 'https://embed.thebitcoincompany.com'
  const iframe_url = iframe_host + '/giftcard'

  useEffect(() => {
    window.addEventListener(
      'message',
      async (event) => {
        if (event.origin != iframe_host) return
        const { invoice, address } = event.data
        if (!invoice) throw new Error('No invoice on TBC response')
        if (!address) throw new Error('No address on TBC response')
        const amountInAddress = address.split('amount=')?.[1]
        if (!amountInAddress) throw new Error('Invalid address format')
        const amount = toSatoshis(Number(amountInAddress), 8)
        const boltzFees = submarineSwapBoltzFees(amount)
        if (!boltzFees) throw new Error('Invalid Boltz fees')
        setPayment({ amount, boltzFees })
      },
      false,
    )
  })

  return (
    <iframe
      src={iframe_url}
      style={{ height: '720px', width: '100%' }}
    ></iframe>
  )
}

export default TBCIFrame
