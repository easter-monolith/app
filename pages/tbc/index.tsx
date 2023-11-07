import NotAllowed from 'components/messages/notAllowed'
import { WalletContext } from 'components/providers/wallet'
import { EnabledTasks, Tasks } from 'lib/tasks'
import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react'
import { getNextAddress, getPublicKey } from 'lib/marina'
import { createSubmarineSwap } from 'lib/swaps'

const TBC: NextPage = () => {
  const { marina, network, updateBalances } = useContext(WalletContext)

  const [amount, setAmount] = useState(0)
  const [boltzFees, setBoltzFees] = useState(0)
  const [waiting, setWaiting] = useState(true)

  const iframe_host = 'https://embed.thebitcoincompany.com'
  const iframe_url = iframe_host + '/giftcard'

  useEffect(() => {
    window.addEventListener(
      'message',
      (event) => {
        if (event.origin != iframe_host) return
        const { invoice, address } = event.data
        if (!invoice || !address) throw new Error('Error with TBC')
        const amount = address.split('amount=')?.[1]
        if (!amount) throw new Error('Invalid address format')
        handleInvoice(Number(amount), invoice)
      },
      false,
    )
  })

  if (!EnabledTasks[Tasks.TBC]) return <NotAllowed />

  // TODO: make this Alby sensitive
  const getRefundPublicKey = async () =>
    (await getPublicKey(await getNextAddress())).toString('hex')

  const handleInvoice = async (
    amount: number,
    invoice: string,
  ): Promise<void> => {
    if (!marina || !network) return
    // we need a refund public key for the swap
    const refundPublicKey = await getRefundPublicKey()
    console.log(invoice, network, refundPublicKey)
    // create swap with Boltz.exchange
    const boltzSwap = await createSubmarineSwap(
      invoice,
      network,
      refundPublicKey,
    )
    if (!boltzSwap) throw new Error('Error creating swap')
    const { address, expectedAmount } = boltzSwap
    setBoltzFees(expectedAmount - amount)
    setAmount(amount)
    setWaiting(false)
  }

  return (
    <section>
      <div className="row">
        <div className="columns">
          <div className="column is-8">
            <iframe
              src={iframe_url}
              style={{ height: '700px', width: '100%' }}
            ></iframe>
          </div>
          <div className="column is-4">
            <div className="is-box has-pink-border is-size-7">
              {waiting ? (
                <p>Waiting for invoice</p>
              ) : (
                <div className="level">
                  <div className="level-left">
                    <div className="level-item">
                      <div>
                        <p>Invoice amount</p>
                        <p>Boltz fees</p>
                        <hr />
                        <p>Total</p>
                      </div>
                    </div>
                  </div>
                  <div className="level-right">
                    <div className="level-item has-text-right">
                      <div className="has-text-right">
                        <p>{amount}</p>
                        <p>{boltzFees}</p>
                        <hr />
                        <p>{amount + boltzFees}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TBC
