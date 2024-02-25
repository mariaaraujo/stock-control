import { ProductService } from '@/service/products/Product'
import type { NextApiRequest, NextApiResponse } from 'next'

const productService = new ProductService()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'PATCH') {
    const productId = req.query.productId?.toString()
    const content = req.body

    if (!productId) {
      console.error('Error to update Product: Missing productId')
      return res.status(400).send({
        error: 'Error to update Product: Missing productId',
      })
    }

    try {
      const product = await productService.update(productId, content)

      return res.status(200).send(product)
    } catch (error) {
      console.error(
        `Error to update Product ${productId}: `,
        JSON.stringify(error),
      )
      return res
        .status(400)
        .send({ error: `Error to update Product ${productId}: ` + error })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
