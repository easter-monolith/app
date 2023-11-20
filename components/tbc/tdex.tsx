import { useContext, useEffect, useState } from 'react'
import { WalletContext } from 'components/providers/wallet'
import { CoinPair, TDEXv2Market, TDEXv2Provider } from 'lib/tdex/types'
import { TradeStatus, TradeStatusMessage } from 'lib/tdex/constants'
import {
  fetchMarketsFromProvider,
  getBestMarket,
  getMarketPrice,
} from 'lib/tdex/market'
import { getProvidersFromRegistry } from 'lib/tdex/registry'
import { getFUSD, getLBTC } from 'lib/assets'
import { NetworkString } from 'marina-provider'
import { tradePreview } from 'lib/tdex/preview'
import { LoadingTDEX, NotFound, Box } from './components'
import { fromSatoshis } from 'lib/utils'

const defaultPair = (network: NetworkString): CoinPair => ({
  from: { ...getFUSD(network) },
  dest: { ...getLBTC(network) },
})

interface TBCTDEXProps {
  FUSDAmount: number
  LBTCAmount: number
  market: TDEXv2Market | undefined
  pair: CoinPair | undefined
  setMarket: (arg0: TDEXv2Market | undefined) => void
  setPair: (arg0: CoinPair) => void
  setFUSDAmount: (arg0: number) => void
  setTradeError: (arg0: string) => void
}

const TBCTDEX = ({
  FUSDAmount,
  LBTCAmount,
  market,
  pair,
  setMarket,
  setPair,
  setFUSDAmount,
  setTradeError,
}: TBCTDEXProps) => {
  const { network } = useContext(WalletContext)

  const [loading, setLoading] = useState('')
  const [markets, setMarkets] = useState<TDEXv2Market[]>([])
  const [providers, setProviders] = useState<TDEXv2Provider[]>([])

  // fetch and set markets (needs to fetch providers)
  useEffect(() => {
    if (!network) return
    const asyncFetchAndSetMarketsAndProviders = async () => {
      try {
        setLoading(TradeStatusMessage.ConnectingTDEX)
        const markets: TDEXv2Market[] = []
        const providers = await getProvidersFromRegistry(network)
        if (providers.length === 0) throw TradeStatusMessage.NoProviders
        for (const provider of providers) {
          try {
            for (let market of await fetchMarketsFromProvider(provider)) {
              try {
                markets.push({
                  ...market,
                  price: await getMarketPrice(market),
                })
              } catch (ignore) {}
            }
          } catch (ignore) {}
        }
        if (markets.length === 0) throw TradeStatusMessage.NoMarkets
        setMarkets(markets)
        setProviders(providers)
      } catch (err) {
        console.error(err)
        setMarkets([])
        setProviders([])
      } finally {
        setLoading('')
      }
    }
    // fetch providers and markets
    asyncFetchAndSetMarketsAndProviders()
    // update pair on network change
    setPair(defaultPair(network))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network])

  // update best market on market or pair changes
  useEffect(() => {
    if (!pair || !markets) return
    setMarket(getBestMarket(markets, pair))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markets, pair])

  // preview trade on amount change
  useEffect(() => {
    if (!LBTCAmount || !market || !pair) return
    const asyncMakeTradePreview = async () => {
      try {
        setLoading('Making preview')
        const preview = await tradePreview(LBTCAmount, pair.dest, market, pair)
        setFUSDAmount(Number(preview.amount))
      } catch (err) {
        setTradeError(err as string)
      } finally {
        setLoading('')
      }
    }
    asyncMakeTradePreview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LBTCAmount])

  if (!LBTCAmount || !network || !pair) return <></>
  if (loading) return <LoadingTDEX title={loading} />
  if (!market) return <NotFound kind="market" />
  if (!markets) return <NotFound kind="markets" />
  if (!providers) return <NotFound kind="providers" />

  return (
    <Box>
      <p>
        <strong>TDEX</strong>
      </p>
      <div className="level">
        <div className="level-left">
          <div className="level-item">
            <div>
              <p>Provider</p>
              <p>Market</p>
              <p>LBTC amount</p>
              <p>FUSD amount</p>
            </div>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item has-text-right">
            <div className="has-text-right">
              <p>{market.provider.name}</p>
              <p>FUSD &rarr; LBTC</p>
              <p>{fromSatoshis(LBTCAmount, 8)}</p>
              <p>{fromSatoshis(FUSDAmount, pair?.from.precision)}</p>
            </div>
          </div>
        </div>
      </div>
    </Box>
  )
}

export default TBCTDEX
