import { prettyQuantity } from 'lib/pretty'
import { Box } from './components'

interface TBCInvoiceProps {
  invoiceAmount: number
  boltzFees: number
}

const TBCInvoice = ({ invoiceAmount, boltzFees }: TBCInvoiceProps) => {
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
                  <p>{prettyQuantity(invoiceAmount, 8, 8)}</p>
                  <p>{prettyQuantity(boltzFees, 8, 8)}</p>
                  <p>{prettyQuantity(invoiceAmount + boltzFees, 8, 8)}</p>
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
