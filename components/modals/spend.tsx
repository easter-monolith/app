/* eslint-disable react/display-name */
import Spinner from 'components/spinner'
import Modal, { ModalIds, ModalStages } from './modal'
import { useContext } from 'react'
import { WalletContext } from 'components/providers/wallet'
import { getAssetBalance } from 'lib/marina'
import { CoinPair } from 'lib/tdex/types'
import { TradeStatus } from 'lib/tdex/constants'
import { fromSatoshis } from 'lib/utils'

interface SpendModalProps {
  error: string
  FUSDAmount: number
  pair: CoinPair | undefined
  stage: TradeStatus
}

const SpendModal = ({ error, FUSDAmount, pair, stage }: SpendModalProps) => {
  const { balances } = useContext(WalletContext)

  if (!pair) return <></>

  // decision variables
  const balance = getAssetBalance(pair.from, balances)
  const ticker = pair.from.ticker
  const neededAmount = FUSDAmount ?? 0
  const hasFunds = FUSDAmount && balance >= FUSDAmount

  if (!hasFunds) {
    return (
      <Modal id={ModalIds.Spend}>
        <h3 className="mt-4">Insufficient funds to spend</h3>
        <p>
          You need{' '}
          <strong>
            {fromSatoshis(neededAmount, pair.from.precision)} {ticker}
          </strong>
        </p>
        <p>
          Your balance is{' '}
          <strong>
            {fromSatoshis(balance, pair.from.precision)} {ticker}
          </strong>
        </p>
      </Modal>
    )
  }

  let ModalContent = () => <></>

  switch (stage) {
    case TradeStatus.SWAPPING:
      ModalContent = () => (
        <>
          <Spinner />
          <h3 className="mt-4">Creating swap with Boltz</h3>
        </>
      )
      break
    case TradeStatus.PROPOSING:
      ModalContent = () => (
        <>
          <Spinner />
          <h3 className="mt-4">Proposing trade</h3>
        </>
      )
      break
    case TradeStatus.CONFIRM:
      ModalContent = () => (
        <>
          <Spinner />
          <h3 className="mt-4">Confirm trade</h3>
          <p>Approve transaction on Marina</p>
        </>
      )
      break
    case TradeStatus.COMPLETED:
      ModalContent = () => <h3 className="mt-4">Trade completed</h3>
      break
    case TradeStatus.ERROR:
      ModalContent = () => (
        <>
          <h3 className="mt-4">Something went wrong</h3>
          <p>{error}</p>
        </>
      )
      break
    default:
      break
  }

  return (
    <Modal id={ModalIds.Spend}>
      <ModalContent />
    </Modal>
  )
}

export default SpendModal
