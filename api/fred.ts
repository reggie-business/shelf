import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { series_id, observation_start } = req.query
  const apiKey = process.env.FRED_API_KEY

  const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${series_id}&api_key=${apiKey}&file_type=json&observation_start=${observation_start}`

  const response = await fetch(url)
  const data = await response.json()

  res.setHeader('Access-Control-Allow-Origin', '*')
  res.status(200).json(data)
}
