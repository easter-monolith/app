import { prettyQuantity } from 'lib/pretty'
import { Box } from './components'
import { useContext } from 'react'
import { WalletContext } from 'components/providers/wallet'
import { getLBTC } from 'lib/assets'

interface TBCInvoiceProps {
  invoiceAmount: number
  boltzFees: number
}

const TBCInvoice = ({ invoiceAmount, boltzFees }: TBCInvoiceProps) => {
  const { network } = useContext(WalletContext)
  if (!network) return <></>

  const { precision } = getLBTC(network)
  const total = invoiceAmount + boltzFees

  return (
    <Box>
      {!invoiceAmount ? (
        <p>&larr; Waiting for invoice</p>
      ) : (
        <>
          <p>
            <strong>Invoice</strong>
          </p>
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <div>
                  <p>Amount</p>
                  <p>Boltz fees</p>
                  <p>Total</p>
                </div>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item has-text-right">
                <div className="has-text-right">
                  <p>{prettyQuantity(invoiceAmount, precision, precision)}</p>
                  <p>{prettyQuantity(boltzFees, precision, precision)}</p>
                  <p>{prettyQuantity(total, precision, precision)}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Box>
  )
}

export default TBCInvoice
