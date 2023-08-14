import type { NextApiRequest, NextApiResponse } from 'next'
import { __db } from '~/libs/prisma.server'

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    let totalViews = await __db.views.aggregate({
      _sum: {
        count: true,
      },
    })
    return res.status(200).json({ total: totalViews._sum.count.toString() })
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}
