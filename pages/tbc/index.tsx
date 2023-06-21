import NotAllowed from 'components/messages/notAllowed'
import { EnabledTasks, Tasks } from 'lib/tasks'
import { NextPage } from 'next'
import { useState } from 'react'

const TBC: NextPage = () => {
  const [address, setAddress] = useState('')
  const [invoice, setInvoice] = useState('')
  const [waiting, setWaiting] = useState(true)

  if (!EnabledTasks[Tasks.TBC]) return <NotAllowed />

  return (
    <section>
      <div className="row">
        <div className="columns">
          <div className="column is-8">
            <iframe
              src="https://app.thebitcoincompany.com/giftcard"
              style={{ height: '420px', width: '100%' }}
            ></iframe>
          </div>
          <div className="column is-4">
            <div className="is-box has-pink-border is-size-7">
              {waiting && (
                <>
                  <p>Waiting for an address or invoice</p>
                  <button
                    onClick={() => {
                      setAddress('an address')
                      setInvoice('an invoice')
                      setWaiting(false)
                    }}
                  >
                    simulate
                  </button>
                </>
              )}
              {invoice && (
                <>
                  <p>Lightning invoice</p>
                  <p>{invoice}</p>
                  <button>Pay with lightning</button>
                </>
              )}
              {address && (
                <>
                  <p>Onchain address</p>
                  <p>{address}</p>
                  <button>Pay with liquid</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TBC
