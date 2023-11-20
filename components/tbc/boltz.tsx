import { BoltzContext } from 'components/providers/boltz'
import { useContext } from 'react'
import { Box } from './components'
import { WalletContext } from 'components/providers/wallet'

const TBCBoltz = () => {
  const { getBoltzFees, getBoltzLimits } = useContext(BoltzContext)
  const { network } = useContext(WalletContext)

  const { minersFees, percentage } = getBoltzFees()
  const limits = getBoltzLimits()

  if (!minersFees) return <></>

  return (
    <Box>
      <p>
        <strong>Boltz fees and limits</strong>
      </p>
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <div>
              <p>Network</p>
              <p>Miners fees</p>
              <p>Percentage</p>
              <p>Min</p>
              <p>Max</p>
            </div>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item has-text-right">
            <div className="has-text-right">
              <p>{network}</p>
              <p>{minersFees} sats</p>
              <p>{percentage}%</p>
              <p>{limits?.minimal} sats</p>
              <p>{limits?.maximal} sats</p>
            </div>
          </div>
        </div>
      </div>
    </Box>
  )
}

export default TBCBoltz
