import { prettyQuantity } from 'lib/pretty'

interface TBCInfoProps {
  amount: number
  fees: number
}

const TBCInfo = ({ amount, fees }: any) => {
  return (
    <div className="is-box has-pink-border is-size-7">
      {!amount ? (
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
                <p>{prettyQuantity(amount, 8, 8)}</p>
                <p>{prettyQuantity(fees, 8, 8)}</p>
                <hr />
                <p>{prettyQuantity(amount + fees, 8, 8)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TBCInfo
