import { BoltzContext } from 'components/providers/boltz'
import { prettyNumber } from 'lib/pretty'
import { Asset } from 'lib/types'
import { fromSatoshis } from 'lib/utils'
import { useContext } from 'react'

interface OutOfBoundsMessageProps {
  asset: Asset
  quantity: number
}

function OutOfBoundsMessage({ asset, quantity }: OutOfBoundsMessageProps) {
  const { getBoltzLimits } = useContext(BoltzContext)
  const { maximal, minimal } = getBoltzLimits()

  const min = fromSatoshis(minimal, asset.precision)
  const max = fromSatoshis(maximal, asset.precision)
  const cur = fromSatoshis(quantity, asset.precision)

  return (
    <>
      <p className="warning mx-auto mt-6">
        For lightning swaps, amount must be between{' '}
        {prettyNumber(min, asset.precision)} and{' '}
        {prettyNumber(max, asset.precision)}
      </p>
      <p className="warning mx-auto mt-3">
        Current amount: <strong>{prettyNumber(cur, asset.precision)}</strong>
      </p>
      <style jsx>{`
        p.warning {
          max-width: 350px;
        }
      `}</style>
    </>
  )
}

export default OutOfBoundsMessage
