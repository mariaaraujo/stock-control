import { ProductService } from '@/service/products/Product'
import type { NextApiRequest, NextApiResponse } from 'next'

const productService = new ProductService()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const productDTO = req.body

    try {
      const product = await productService.create(productDTO)

      return res.status(200).send(product)
    } catch (error) {
      console.error('Error to create Product: ', JSON.stringify(error))

      return res.status(400).send({
        error: 'Error to create Product: ' + error,
      })
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
