import { useContext, useState } from 'react'
import TBCIFrame from './iframe'
import TBCInvoice from './invoice'
import TBCButton from './button'
import { toSatoshis } from 'lib/utils'
import { BoltzContext } from 'components/providers/boltz'
import TBCTDEX from './tdex'
import TBCBoltz from './boltz'
import { CoinPair, TDEXv2Market } from 'lib/tdex/types'
import SpendModal from 'components/modals/spend'
import { TradeStatus } from 'lib/tdex/constants'

const TBC = () => {
  const { calcBoltzFees } = useContext(BoltzContext)

  const [boltzFees, setBoltzFees] = useState(0)
  const [FUSDAmount, setFUSDAmount] = useState(0)
  const [invoiceAmount, setInvoiceAmount] = useState(0)
  const [invoice, setInvoice] = useState('')
  const [market, setMarket] = useState<TDEXv2Market>()
  const [pair, setPair] = useState<CoinPair>()
  const [tradeError, setTradeError] = useState('')
  const [tradeStatus, setTradeStatus] = useState(TradeStatus.SWAPPING)

  const setAddress = (address: string) => {
    const amountInAddress = address.split('amount=')?.[1]
    if (!amountInAddress) throw new Error('Invalid address format')
    const amount = toSatoshis(Number(amountInAddress), 8)
    const fees = calcBoltzFees(amount)
    setBoltzFees(fees)
    setInvoiceAmount(amount)
  }

  const LBTCAmount = invoiceAmount + boltzFees

  return (
    <section>
      <div className="row">
        <div className="columns">
          <div className="column is-8">
            <TBCIFrame setAddress={setAddress} setInvoice={setInvoice} />
          </div>
          <div className="column is-4">
            <TBCBoltz />
            <TBCInvoice invoiceAmount={invoiceAmount} boltzFees={boltzFees} />
            <TBCTDEX
              FUSDAmount={FUSDAmount}
              LBTCAmount={LBTCAmount}
              market={market}
              pair={pair}
              setMarket={setMarket}
              setPair={setPair}
              setFUSDAmount={setFUSDAmount}
              setTradeError={setTradeError}
            />
            <TBCButton
              FUSDAmount={FUSDAmount}
              invoice={invoice}
              pair={pair}
              setTradeError={setTradeError}
              setTradeStatus={setTradeStatus}
            />
          </div>
        </div>
      </div>
      <SpendModal
        error={tradeError}
        FUSDAmount={FUSDAmount}
        pair={pair}
        stage={tradeStatus}
      />
    </section>
  )
}

export default TBC
