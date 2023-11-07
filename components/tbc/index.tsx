import { useState } from 'react'
import TBCIFrame from './iframe'
import TBCInfo from './info'
import TBCButton from './button'

const TBC = () => {
  const [payment, setPayment] = useState({ amount: 0, boltzFees: 0 })

  return (
    <section>
      <div className="row">
        <div className="columns">
          <div className="column is-8">
            <TBCIFrame setPayment={setPayment} />
          </div>
          <div className="column is-4">
            <TBCInfo payment={payment} />
            <TBCButton payment={payment} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default TBC
