import { ProductService } from '@/service/products/Product'
import type { NextApiRequest, NextApiResponse } from 'next'

const productService = new ProductService()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const userId = req.query.userId?.toString()

    // const filter = req.query.filter?.toString()

    // const params = {
    //   filter: filter ? JSON.parse(filter) : {},
    // }

    try {
      const products = await productService.get(userId!)

      return res.status(200).send(products)
    } catch (e) {
      console.error('Error to get products: ', JSON.stringify(e))
      return res.status(400).send({ error: 'Error to get products : ' + e })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
