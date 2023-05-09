// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { apiOffers } from 'lib/server'
import { NetworkString } from 'marina-provider'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const network = req.query.network as NetworkString
  const { params } = req.query
  if (typeof params === 'undefined' || params.length !== 2)
    res.status(404).json({ message: `invalid url` })
  const offers = await apiOffers(network)
  if (!offers) res.status(404).json({ message: `offers not found` })
  const offer = offers.find(
    ({ collateral, synthetic }) =>
      collateral.ticker === params?.[1] && synthetic.ticker === params[0],
  )
  if (!offer) res.status(404).json({ message: `offer not found` })
  res.status(200).json(offer)
}
