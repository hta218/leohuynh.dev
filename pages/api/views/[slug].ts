import type { NextApiRequest, NextApiResponse } from 'next'
import { __db } from '~/libs/prisma.server'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let slug = req.query.slug.toString()
    if (req.method === 'POST') {
      let newOrUpdatedViews = await __db.views.upsert({
        where: { slug },
        create: {
          slug,
        },
        update: {
          count: {
            increment: 1,
          },
        },
      })
      return res.status(200).json({
        total: newOrUpdatedViews.count.toString(),
      })
    }
    if (req.method === 'GET') {
      let views = await __db.views.findUnique({
        where: {
          slug,
        },
      })
      return res.status(200).json({ total: views?.count?.toString?.() || 0 })
    }
  } catch (e) {
    return res.status(500).json({ message: e.message })
  }
}
