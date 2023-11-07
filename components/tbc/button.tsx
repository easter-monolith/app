const TBCButton = ({ payment }: any) => {
  return (
    <div className="has-text-centered">
      <button
        className="button is-primary is-cta"
        disabled={!payment.amount}
        onClick={() => {}}
      >
        Pay with Liquid
      </button>
    </div>
  )
}

export default TBCButton
