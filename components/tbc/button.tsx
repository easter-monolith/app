interface TBCButtonProps {
  amount: number
  fees: number
  invoice: string
}

const TBCButton = ({ amount, fees, invoice }: TBCButtonProps) => {
  const handleClick = () => {
    const total = amount + fees
  }

  return (
    <div className="has-text-centered">
      <button
        className="button is-primary is-cta"
        disabled={!amount}
        onClick={handleClick}
      >
        Pay with Liquid
      </button>
    </div>
  )
}

export default TBCButton
