import { useEffect } from 'react'

interface TBCIFrameProps {
  setAddress: (arg0: string) => void
  setInvoice: (arg0: string) => void
}

const TBCIFrame = ({ setAddress, setInvoice }: TBCIFrameProps) => {
  const iframe_host = 'https://embed.thebitcoincompany.com'
  const iframe_url = iframe_host + '/giftcard'

  useEffect(() => {
    window.addEventListener(
      'message',
      async (event) => {
        if (event.origin != iframe_host) return
        const { invoice, address } = event.data
        if (!address) throw new Error('No address on TBC response')
        if (!invoice) throw new Error('No invoice on TBC response')
        setAddress(address)
        setInvoice(invoice)
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
