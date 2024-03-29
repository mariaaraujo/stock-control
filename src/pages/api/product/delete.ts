import { ProductService } from '@/service/products/Product'
import type { NextApiRequest, NextApiResponse } from 'next'

const productService = new ProductService()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'DELETE') {
    const productId = req.query.id?.toString()

    if (!productId) {
      console.error('Error to delete Product: Missing productId')
      return res.status(400).send({
        error: 'Error to delete Product: Missing productId',
      })
    }

    try {
      const product = await productService.delete(productId)

      return res.status(200).send(product)
    } catch (error) {
      console.error(
        `Error to delete Product ${productId}: `,
        JSON.stringify(error),
      )
      return res
        .status(400)
        .send({ error: `Error to delete Product ${productId}: ` + error })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
