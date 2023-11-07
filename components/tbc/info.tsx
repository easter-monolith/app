import { prettyQuantity } from 'lib/pretty'

const TBCInfo = ({ payment }: any) => {
  return (
    <div className="is-box has-pink-border is-size-7">
      {!payment.amount ? (
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
                <p>{prettyQuantity(payment.amount, 8, 8)}</p>
                <p>{prettyQuantity(payment.boltzFees, 8, 8)}</p>
                <hr />
                <p>
                  {prettyQuantity(payment.amount + payment.boltzFees, 8, 8)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TBCInfo
