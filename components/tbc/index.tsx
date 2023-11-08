import { useContext, useState } from 'react'
import TBCIFrame from './iframe'
import TBCInfo from './info'
import TBCButton from './button'
import { toSatoshis } from 'lib/utils'
import { BoltzContext } from 'components/providers/boltz'

const TBC = () => {
  const { getBoltzFees } = useContext(BoltzContext)
  const [amount, setAmount] = useState(0)
  const [fees, setFees] = useState(0)
  const [invoice, setInvoice] = useState('')

  const setAddress = (address: string) => {
    const amountInAddress = address.split('amount=')?.[1]
    if (!amountInAddress) throw new Error('Invalid address format')
    const amount = toSatoshis(Number(amountInAddress), 8)
    const boltzFees = getBoltzFees(amount, 'lightning')
    setAmount(amount)
    setFees(boltzFees)
  }

  return (
    <section>
      <div className="row">
        <div className="columns">
          <div className="column is-8">
            <TBCIFrame setAddress={setAddress} setInvoice={setInvoice} />
          </div>
          <div className="column is-4">
            <TBCInfo amount={amount} fees={fees} />
            <TBCButton amount={amount} fees={fees} invoice={invoice} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TBC
